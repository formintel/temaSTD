import type { BaseJob, JobTaskStatus } from '../config/types/workflowTypes.js';
type Args = {
    jobLog: BaseJob['log'];
};
export declare const getJobTaskStatus: ({ jobLog }: Args) => JobTaskStatus;
export {};
//# sourceMappingURL=getJobTaskStatus.d.ts.map