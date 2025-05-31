// @ts-strict-ignore
import { getRunTaskFunction } from '../runJob/getRunTaskFunction.js';
import { handleWorkflowError } from '../runJob/handleWorkflowError.js';
export const runJSONJob = async ({ job, req, updateJob, workflowConfig, workflowHandler })=>{
    // Object so that we can pass contents by reference, not value.
    // We want any mutations to be reflected in here.
    const state = {
        reachedMaxRetries: false
    };
    const stepsToRun = [];
    for (const step of workflowHandler){
        if ('task' in step) {
            if (job?.taskStatus?.[step.task]?.[step.id]?.complete) {
                continue;
            }
        } else {
            if (job?.taskStatus?.['inline']?.[step.id]?.complete) {
                continue;
            }
        }
        if (step.condition && !step.condition({
            job: job
        })) {
            continue;
        }
        stepsToRun.push(step);
    }
    const tasks = getRunTaskFunction(state, job, workflowConfig, req, false, updateJob);
    const inlineTask = getRunTaskFunction(state, job, workflowConfig, req, true, updateJob);
    // Run the job
    let hasFinalError = false;
    let error;
    try {
        await Promise.all(stepsToRun.map(async (step)=>{
            if ('task' in step) {
                await tasks[step.task](step.id, {
                    input: step.input ? step.input({
                        job: job
                    }) : {},
                    retries: step.retries
                });
            } else {
                await inlineTask(step.id, {
                    retries: step.retries,
                    task: step.inlineTask
                });
            }
        }));
    } catch (err) {
        const errorResult = handleWorkflowError({
            error: err,
            job,
            req,
            state,
            workflowConfig
        });
        error = err;
        hasFinalError = errorResult.hasFinalError;
    }
    // Check if workflow has completed
    let workflowCompleted = false;
    for (const [slug, map] of Object.entries(job.taskStatus)){
        for (const [id, taskStatus] of Object.entries(map)){
            if (taskStatus.complete) {
                const step = workflowHandler.find((step)=>{
                    if ('task' in step) {
                        return step.task === slug && step.id === id;
                    } else {
                        return step.id === id && slug === 'inline';
                    }
                });
                if (step.completesJob) {
                    workflowCompleted = true;
                    break;
                }
            }
        }
    }
    if (workflowCompleted) {
        if (error) {
            // Tasks update the job if they error - but in case there is an unhandled error (e.g. in the workflow itself, not in a task)
            // we need to ensure the job is updated to reflect the error
            await updateJob({
                completedAt: new Date().toISOString(),
                error: hasFinalError ? error : undefined,
                hasError: hasFinalError,
                processing: false,
                totalTried: (job.totalTried ?? 0) + 1
            });
        } else {
            await updateJob({
                completedAt: new Date().toISOString(),
                processing: false,
                totalTried: (job.totalTried ?? 0) + 1
            });
        }
        return {
            status: 'success'
        };
    } else {
        if (error) {
            // Tasks update the job if they error - but in case there is an unhandled error (e.g. in the workflow itself, not in a task)
            // we need to ensure the job is updated to reflect the error
            await updateJob({
                error: hasFinalError ? error : undefined,
                hasError: hasFinalError,
                processing: false,
                totalTried: (job.totalTried ?? 0) + 1
            });
            return {
                status: hasFinalError ? 'error-reached-max-retries' : 'error'
            };
        } else {
            // Retry the job - no need to bump processing or totalTried as this does not count as a retry. A condition of a different task might have just opened up!
            return await runJSONJob({
                job,
                req,
                updateJob,
                workflowConfig,
                workflowHandler
            });
        }
    }
};

//# sourceMappingURL=index.js.map