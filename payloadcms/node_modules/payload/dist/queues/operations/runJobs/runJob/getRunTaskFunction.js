import ObjectIdImport from 'bson-objectid';
import { calculateBackoffWaitUntil } from './calculateBackoffWaitUntil.js';
import { importHandlerPath } from './importHandlerPath.js';
const ObjectId = ObjectIdImport.default || ObjectIdImport;
async function getTaskHandlerFromConfig(taskConfig) {
    let handler;
    if (typeof taskConfig.handler === 'function') {
        handler = taskConfig.handler;
    } else {
        handler = await importHandlerPath(taskConfig.handler);
    }
    return handler;
}
export async function handleTaskFailed({ error, executedAt, input, job, maxRetries, output, parent, req, retriesConfig, state, taskConfig, taskHandlerResult, taskID, taskSlug, taskStatus, updateJob }) {
    req.payload.logger.error({
        err: error,
        job,
        msg: `Error running task ${taskID}`,
        taskSlug
    });
    if (taskConfig?.onFail) {
        await taskConfig.onFail();
    }
    if (!job.log) {
        job.log = [];
    }
    const errorJSON = error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
    } : {
        message: taskHandlerResult.state === 'failed' ? taskHandlerResult.errorMessage ?? taskHandlerResult.state : 'failed'
    };
    job.log.push({
        id: new ObjectId().toHexString(),
        completedAt: new Date().toISOString(),
        error: errorJSON,
        executedAt: executedAt.toISOString(),
        input,
        output,
        parent: req?.payload?.config?.jobs?.addParentToTaskLog ? parent : undefined,
        state: 'failed',
        taskID,
        taskSlug
    });
    if (job.waitUntil) {
        // Check if waitUntil is in the past
        const waitUntil = new Date(job.waitUntil);
        if (waitUntil < new Date()) {
            // Outdated waitUntil, remove it
            delete job.waitUntil;
        }
    }
    if (!taskStatus?.complete && (taskStatus?.totalTried ?? 0) >= maxRetries) {
        state.reachedMaxRetries = true;
        await updateJob({
            error,
            hasError: true,
            log: job.log,
            processing: false,
            waitUntil: job.waitUntil
        });
        throw new Error(`Task ${taskSlug} has failed more than the allowed retries in workflow ${job.workflowSlug}${error ? `. Error: ${String(error)}` : ''}`);
    } else {
        // Job will retry. Let's determine when!
        const waitUntil = calculateBackoffWaitUntil({
            retriesConfig,
            totalTried: taskStatus?.totalTried ?? 0
        });
        // Update job's waitUntil only if this waitUntil is later than the current one
        if (!job.waitUntil || waitUntil > new Date(job.waitUntil)) {
            job.waitUntil = waitUntil.toISOString();
        }
        await updateJob({
            log: job.log,
            processing: false,
            waitUntil: job.waitUntil
        });
        throw error ?? new Error('Task failed');
    }
}
export const getRunTaskFunction = (state, job, workflowConfig, req, isInline, updateJob, parent)=>{
    const runTask = (taskSlug)=>async (taskID, { input, retries, task })=>{
            const executedAt = new Date();
            let inlineRunner = null;
            if (isInline) {
                inlineRunner = task;
            }
            let taskConfig;
            if (!isInline) {
                taskConfig = req.payload.config.jobs.tasks?.length && req.payload.config.jobs.tasks.find((t)=>t.slug === taskSlug);
                if (!taskConfig) {
                    throw new Error(`Task ${taskSlug} not found in workflow ${job.workflowSlug}`);
                }
            }
            const retriesConfigFromPropsNormalized = retries == undefined || retries == null ? {} : typeof retries === 'number' ? {
                attempts: retries
            } : retries;
            const retriesConfigFromTaskConfigNormalized = taskConfig ? typeof taskConfig.retries === 'number' ? {
                attempts: taskConfig.retries
            } : taskConfig.retries : {};
            const finalRetriesConfig = {
                ...retriesConfigFromTaskConfigNormalized,
                ...retriesConfigFromPropsNormalized
            };
            const taskStatus = job?.taskStatus?.[taskSlug] ? job.taskStatus[taskSlug][taskID] : null;
            // Handle restoration of task if it succeeded in a previous run
            if (taskStatus && taskStatus.complete === true) {
                let shouldRestore = true;
                if (finalRetriesConfig?.shouldRestore === false) {
                    shouldRestore = false;
                } else if (typeof finalRetriesConfig?.shouldRestore === 'function') {
                    shouldRestore = await finalRetriesConfig.shouldRestore({
                        input,
                        job,
                        req,
                        taskStatus
                    });
                }
                if (shouldRestore) {
                    return taskStatus.output;
                }
            }
            let runner;
            if (isInline) {
                runner = inlineRunner;
            } else {
                if (!taskConfig) {
                    throw new Error(`Task ${taskSlug} not found in workflow ${job.workflowSlug}`);
                }
                runner = await getTaskHandlerFromConfig(taskConfig);
            }
            if (!runner || typeof runner !== 'function') {
                const errorMessage = isInline ? `Can't find runner for inline task with ID ${taskID}` : `Can't find runner while importing with the path ${typeof workflowConfig.handler === 'string' ? workflowConfig.handler : 'unknown - no string path'} in job type ${job.workflowSlug} for task ${taskSlug}.`;
                req.payload.logger.error(errorMessage);
                await updateJob({
                    error: {
                        error: errorMessage
                    },
                    hasError: true,
                    log: [
                        ...job.log,
                        {
                            id: new ObjectId().toHexString(),
                            completedAt: new Date().toISOString(),
                            error: errorMessage,
                            executedAt: executedAt.toISOString(),
                            parent: req?.payload?.config?.jobs?.addParentToTaskLog ? parent : undefined,
                            state: 'failed',
                            taskID,
                            taskSlug
                        }
                    ],
                    processing: false
                });
                throw new Error(errorMessage);
            }
            let maxRetries = finalRetriesConfig?.attempts;
            if (maxRetries === undefined || maxRetries === null) {
                // Inherit retries from workflow config, if they are undefined and the workflow config has retries configured
                if (workflowConfig.retries !== undefined && workflowConfig.retries !== null) {
                    maxRetries = typeof workflowConfig.retries === 'object' ? workflowConfig.retries.attempts : workflowConfig.retries;
                } else {
                    maxRetries = 0;
                }
            }
            let taskHandlerResult;
            let output = {};
            try {
                taskHandlerResult = await runner({
                    inlineTask: getRunTaskFunction(state, job, workflowConfig, req, true, updateJob, {
                        taskID,
                        taskSlug
                    }),
                    input,
                    job: job,
                    req,
                    tasks: getRunTaskFunction(state, job, workflowConfig, req, false, updateJob, {
                        taskID,
                        taskSlug
                    })
                });
            } catch (err) {
                await handleTaskFailed({
                    error: err,
                    executedAt,
                    input,
                    job,
                    maxRetries,
                    output,
                    parent,
                    req,
                    retriesConfig: finalRetriesConfig,
                    state,
                    taskConfig,
                    taskID,
                    taskSlug,
                    taskStatus,
                    updateJob
                });
                throw new Error('Task failed');
            }
            if (taskHandlerResult.state === 'failed') {
                await handleTaskFailed({
                    executedAt,
                    input,
                    job,
                    maxRetries,
                    output,
                    parent,
                    req,
                    retriesConfig: finalRetriesConfig,
                    state,
                    taskConfig,
                    taskHandlerResult,
                    taskID,
                    taskSlug,
                    taskStatus,
                    updateJob
                });
                throw new Error('Task failed');
            } else {
                output = taskHandlerResult.output;
            }
            if (taskConfig?.onSuccess) {
                await taskConfig.onSuccess();
            }
            if (!job.log) {
                job.log = [];
            }
            job.log.push({
                id: new ObjectId().toHexString(),
                completedAt: new Date().toISOString(),
                executedAt: executedAt.toISOString(),
                input,
                output,
                parent: req?.payload?.config?.jobs?.addParentToTaskLog ? parent : undefined,
                state: 'succeeded',
                taskID,
                taskSlug
            });
            await updateJob({
                log: job.log
            });
            return output;
        };
    if (isInline) {
        return runTask('inline');
    } else {
        const tasks = {};
        for (const task of req?.payload?.config?.jobs?.tasks ?? []){
            tasks[task.slug] = runTask(task.slug);
        }
        return tasks;
    }
};

//# sourceMappingURL=getRunTaskFunction.js.map