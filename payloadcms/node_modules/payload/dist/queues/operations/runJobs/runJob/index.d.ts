import type { PayloadRequest } from '../../../../types/index.js';
import type { BaseJob, WorkflowConfig, WorkflowHandler, WorkflowTypes } from '../../../config/types/workflowTypes.js';
import type { UpdateJobFunction } from './getUpdateJobFunction.js';
type Args = {
    job: BaseJob;
    req: PayloadRequest;
    updateJob: UpdateJobFunction;
    workflowConfig: WorkflowConfig<WorkflowTypes>;
    workflowHandler: WorkflowHandler<WorkflowTypes>;
};
export type JobRunStatus = 'error' | 'error-reached-max-retries' | 'success';
export type RunJobResult = {
    status: JobRunStatus;
};
export declare const runJob: ({ job, req, updateJob, workflowConfig, workflowHandler, }: Args) => Promise<RunJobResult>;
export {};
//# sourceMappingURL=index.d.ts.map