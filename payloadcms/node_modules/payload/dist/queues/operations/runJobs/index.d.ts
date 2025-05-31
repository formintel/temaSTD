import type { PayloadRequest, Sort, Where } from '../../../types/index.js';
import type { RunJobResult } from './runJob/index.js';
export type RunJobsArgs = {
    /**
     * ID of the job to run
     */
    id?: number | string;
    limit?: number;
    overrideAccess?: boolean;
    /**
     * Adjust the job processing order
     *
     * FIFO would equal `createdAt` and LIFO would equal `-createdAt`.
     *
     * @default all jobs for all queues will be executed in FIFO order.
     */
    processingOrder?: Sort;
    queue?: string;
    req: PayloadRequest;
    /**
     * By default, jobs are run in parallel.
     * If you want to run them in sequence, set this to true.
     */
    sequential?: boolean;
    where?: Where;
};
export type RunJobsResult = {
    jobStatus?: Record<string, RunJobResult>;
    /**
     * If this is false, there for sure are no jobs remaining, regardless of the limit
     */
    noJobsRemaining?: boolean;
    /**
     * Out of the jobs that were queried & processed (within the set limit), how many are remaining and retryable?
     */
    remainingJobsFromQueried: number;
};
export declare const runJobs: (args: RunJobsArgs) => Promise<RunJobsResult>;
//# sourceMappingURL=index.d.ts.map