import type { PayloadRequest } from '../../../../types/index.js';
import type { BaseJob, WorkflowConfig, WorkflowTypes } from '../../../config/types/workflowTypes.js';
import type { RunTaskFunctionState } from './getRunTaskFunction.js';
/**
 * This is called if a workflow catches an error. It determines if it's a final error
 * or not and handles logging.
 */
export declare function handleWorkflowError({ error, job, req, state, workflowConfig, }: {
    error: Error;
    job: BaseJob;
    req: PayloadRequest;
    state: RunTaskFunctionState;
    workflowConfig: WorkflowConfig<WorkflowTypes>;
}): {
    hasFinalError: boolean;
};
//# sourceMappingURL=handleWorkflowError.d.ts.map