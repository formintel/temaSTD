// @ts-strict-ignore
import { Forbidden } from '../../../errors/Forbidden.js';
import isolateObjectProperty from '../../../utilities/isolateObjectProperty.js';
import { jobsCollectionSlug } from '../../config/index.js';
import { updateJob, updateJobs } from '../../utilities/updateJob.js';
import { getUpdateJobFunction } from './runJob/getUpdateJobFunction.js';
import { importHandlerPath } from './runJob/importHandlerPath.js';
import { runJob } from './runJob/index.js';
import { runJSONJob } from './runJSONJob/index.js';
export const runJobs = async (args)=>{
    const { id, limit = 10, overrideAccess, processingOrder, queue, req, sequential, where: whereFromProps } = args;
    if (!overrideAccess) {
        const hasAccess = await req.payload.config.jobs.access.run({
            req
        });
        if (!hasAccess) {
            throw new Forbidden(req.t);
        }
    }
    const where = {
        and: [
            {
                completedAt: {
                    exists: false
                }
            },
            {
                hasError: {
                    not_equals: true
                }
            },
            {
                processing: {
                    equals: false
                }
            },
            {
                or: [
                    {
                        waitUntil: {
                            exists: false
                        }
                    },
                    {
                        waitUntil: {
                            less_than: new Date().toISOString()
                        }
                    }
                ]
            }
        ]
    };
    if (queue) {
        where.and.push({
            queue: {
                equals: queue
            }
        });
    }
    if (whereFromProps) {
        where.and.push(whereFromProps);
    }
    // Find all jobs and ensure we set job to processing: true as early as possible to reduce the chance of
    // the same job being picked up by another worker
    const jobsQuery = {
        docs: []
    };
    if (id) {
        // Only one job to run
        jobsQuery.docs = [
            await updateJob({
                id,
                data: {
                    processing: true
                },
                depth: req.payload.config.jobs.depth,
                disableTransaction: true,
                req,
                returning: true
            })
        ];
    } else {
        let defaultProcessingOrder = req.payload.collections[jobsCollectionSlug].config.defaultSort ?? 'createdAt';
        const processingOrderConfig = req.payload.config.jobs?.processingOrder;
        if (typeof processingOrderConfig === 'function') {
            defaultProcessingOrder = await processingOrderConfig(args);
        } else if (typeof processingOrderConfig === 'object' && !Array.isArray(processingOrderConfig)) {
            if (queue && processingOrderConfig.queues && processingOrderConfig.queues[queue]) {
                defaultProcessingOrder = processingOrderConfig.queues[queue];
            } else if (processingOrderConfig.default) {
                defaultProcessingOrder = processingOrderConfig.default;
            }
        } else if (typeof processingOrderConfig === 'string') {
            defaultProcessingOrder = processingOrderConfig;
        }
        const updatedDocs = await updateJobs({
            data: {
                processing: true
            },
            depth: req.payload.config.jobs.depth,
            disableTransaction: true,
            limit,
            req,
            returning: true,
            sort: processingOrder ?? defaultProcessingOrder,
            where
        });
        if (updatedDocs) {
            jobsQuery.docs = updatedDocs;
        }
    }
    /**
   * Just for logging purposes, we want to know how many jobs are new and how many are existing (= already been tried).
   * This is only for logs - in the end we still want to run all jobs, regardless of whether they are new or existing.
   */ const { existingJobs, newJobs } = jobsQuery.docs.reduce((acc, job)=>{
        if (job.totalTried > 0) {
            acc.existingJobs.push(job);
        } else {
            acc.newJobs.push(job);
        }
        return acc;
    }, {
        existingJobs: [],
        newJobs: []
    });
    if (!jobsQuery.docs.length) {
        return {
            noJobsRemaining: true,
            remainingJobsFromQueried: 0
        };
    }
    if (jobsQuery?.docs?.length) {
        req.payload.logger.info({
            msg: `Running ${jobsQuery.docs.length} jobs.`,
            new: newJobs?.length,
            retrying: existingJobs?.length
        });
    }
    const jobsToDelete = req.payload.config.jobs.deleteJobOnComplete ? [] : undefined;
    const runSingleJob = async (job)=>{
        if (!job.workflowSlug && !job.taskSlug) {
            throw new Error('Job must have either a workflowSlug or a taskSlug');
        }
        const jobReq = isolateObjectProperty(req, 'transactionID');
        const workflowConfig = job.workflowSlug ? req.payload.config.jobs?.workflows.find(({ slug })=>slug === job.workflowSlug) : {
            slug: 'singleTask',
            handler: async ({ job, tasks })=>{
                await tasks[job.taskSlug]('1', {
                    input: job.input
                });
            }
        };
        if (!workflowConfig) {
            return null // Skip jobs with no workflow configuration
            ;
        }
        const updateJob = getUpdateJobFunction(job, jobReq);
        // the runner will either be passed to the config
        // OR it will be a path, which we will need to import via eval to avoid
        // Next.js compiler dynamic import expression errors
        let workflowHandler;
        if (typeof workflowConfig.handler === 'function' || typeof workflowConfig.handler === 'object' && Array.isArray(workflowConfig.handler)) {
            workflowHandler = workflowConfig.handler;
        } else {
            workflowHandler = await importHandlerPath(workflowConfig.handler);
            if (!workflowHandler) {
                const jobLabel = job.workflowSlug || `Task: ${job.taskSlug}`;
                const errorMessage = `Can't find runner while importing with the path ${workflowConfig.handler} in job type ${jobLabel}.`;
                req.payload.logger.error(errorMessage);
                await updateJob({
                    error: {
                        error: errorMessage
                    },
                    hasError: true,
                    processing: false
                });
                return;
            }
        }
        if (typeof workflowHandler === 'function') {
            const result = await runJob({
                job,
                req: jobReq,
                updateJob,
                workflowConfig,
                workflowHandler
            });
            if (result.status !== 'error' && jobsToDelete) {
                jobsToDelete.push(job.id);
            }
            return {
                id: job.id,
                result
            };
        } else {
            const result = await runJSONJob({
                job,
                req: jobReq,
                updateJob,
                workflowConfig,
                workflowHandler
            });
            if (result.status !== 'error' && jobsToDelete) {
                jobsToDelete.push(job.id);
            }
            return {
                id: job.id,
                result
            };
        }
    };
    let resultsArray = [];
    if (sequential) {
        for (const job of jobsQuery.docs){
            const result = await runSingleJob(job);
            if (result !== null) {
                resultsArray.push(result);
            }
        }
    } else {
        const jobPromises = jobsQuery.docs.map(runSingleJob);
        resultsArray = await Promise.all(jobPromises);
    }
    if (jobsToDelete && jobsToDelete.length > 0) {
        try {
            if (req.payload.config.jobs.runHooks) {
                await req.payload.delete({
                    collection: jobsCollectionSlug,
                    depth: 0,
                    disableTransaction: true,
                    where: {
                        id: {
                            in: jobsToDelete
                        }
                    }
                });
            } else {
                await req.payload.db.deleteMany({
                    collection: jobsCollectionSlug,
                    where: {
                        id: {
                            in: jobsToDelete
                        }
                    }
                });
            }
        } catch (err) {
            req.payload.logger.error({
                err,
                msg: `failed to delete jobs ${jobsToDelete.join(', ')} on complete`
            });
        }
    }
    const resultsObject = resultsArray.reduce((acc, cur)=>{
        if (cur !== null) {
            // Check if there's a valid result to include
            acc[cur.id] = cur.result;
        }
        return acc;
    }, {});
    let remainingJobsFromQueried = 0;
    for(const jobID in resultsObject){
        const jobResult = resultsObject[jobID];
        if (jobResult.status === 'error') {
            remainingJobsFromQueried++ // Can be retried
            ;
        }
    }
    return {
        jobStatus: resultsObject,
        remainingJobsFromQueried
    };
};

//# sourceMappingURL=index.js.map