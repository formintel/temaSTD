import type { RunningJobFromTask } from './config/types/workflowTypes.js';
import { type Payload, type PayloadRequest, type RunningJob, type Sort, type TypedJobs, type Where } from '../index.js';
import { runJobs } from './operations/runJobs/index.js';
export declare const getJobsLocalAPI: (payload: Payload) => {
    queue: <TTaskOrWorkflowSlug extends keyof TypedJobs["tasks"] | keyof TypedJobs["workflows"]>(args: {
        input: TypedJobs["tasks"][TTaskOrWorkflowSlug]["input"];
        queue?: string;
        req?: PayloadRequest;
        task: TTaskOrWorkflowSlug extends keyof TypedJobs["tasks"] ? TTaskOrWorkflowSlug : never;
        waitUntil?: Date;
        workflow?: never;
    } | {
        input: TypedJobs["workflows"][TTaskOrWorkflowSlug]["input"];
        queue?: string;
        req?: PayloadRequest;
        task?: never;
        waitUntil?: Date;
        workflow: TTaskOrWorkflowSlug extends keyof TypedJobs["workflows"] ? TTaskOrWorkflowSlug : never;
    }) => Promise<TTaskOrWorkflowSlug extends keyof TypedJobs["workflows"] ? RunningJob<TTaskOrWorkflowSlug> : RunningJobFromTask<TTaskOrWorkflowSlug>>;
    run: (args?: {
        limit?: number;
        overrideAccess?: boolean;
        /**
         * Adjust the job processing order using a Payload sort string.
         *
         * FIFO would equal `createdAt` and LIFO would equal `-createdAt`.
         */
        processingOrder?: Sort;
        queue?: string;
        req?: PayloadRequest;
        /**
         * By default, jobs are run in parallel.
         * If you want to run them in sequence, set this to true.
         */
        sequential?: boolean;
        where?: Where;
    }) => Promise<ReturnType<typeof runJobs>>;
    runByID: (args: {
        id: number | string;
        overrideAccess?: boolean;
        req?: PayloadRequest;
    }) => Promise<ReturnType<typeof runJobs>>;
    cancel: (args: {
        overrideAccess?: boolean;
        queue?: string;
        req?: PayloadRequest;
        where: Where;
    }) => Promise<void>;
    cancelByID: (args: {
        id: number | string;
        overrideAccess?: boolean;
        req?: PayloadRequest;
    }) => Promise<void>;
};
//# sourceMappingURL=localAPI.d.ts.map