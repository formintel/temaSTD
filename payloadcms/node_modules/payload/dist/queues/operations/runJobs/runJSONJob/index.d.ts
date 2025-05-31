import type { PayloadRequest } from '../../../../types/index.js';
import type { WorkflowJSON } from '../../../config/types/workflowJSONTypes.js';
import type { BaseJob, WorkflowConfig, WorkflowTypes } from '../../../config/types/workflowTypes.js';
import type { UpdateJobFunction } from '../runJob/getUpdateJobFunction.js';
import type { JobRunStatus } from '../runJob/index.js';
type Args = {
    job: BaseJob;
    req: PayloadRequest;
    updateJob: UpdateJobFunction;
    workflowConfig: WorkflowConfig<WorkflowTypes>;
    workflowHandler: WorkflowJSON<WorkflowTypes>;
};
export type RunJSONJobResult = {
    status: JobRunStatus;
};
export declare const runJSONJob: ({ job, req, updateJob, workflowConfig, workflowHandler, }: Args) => Promise<RunJSONJobResult>;
export {};
//# sourceMappingURL=index.d.ts.map