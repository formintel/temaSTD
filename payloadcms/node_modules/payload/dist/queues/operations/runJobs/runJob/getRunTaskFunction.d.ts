import type { PayloadRequest } from '../../../../types/index.js';
import type { RetryConfig, RunInlineTaskFunction, RunTaskFunctions, TaskConfig, TaskHandlerResult } from '../../../config/types/taskTypes.js';
import type { BaseJob, SingleTaskStatus, WorkflowConfig } from '../../../config/types/workflowTypes.js';
import type { UpdateJobFunction } from './getUpdateJobFunction.js';
export type RunTaskFunctionState = {
    reachedMaxRetries: boolean;
};
export declare function handleTaskFailed({ error, executedAt, input, job, maxRetries, output, parent, req, retriesConfig, state, taskConfig, taskHandlerResult, taskID, taskSlug, taskStatus, updateJob, }: {
    error?: Error;
    executedAt: Date;
    input: object;
    job: BaseJob;
    maxRetries: number;
    output: object;
    parent?: TaskParent;
    req: PayloadRequest;
    retriesConfig: number | RetryConfig;
    state: RunTaskFunctionState;
    taskConfig?: TaskConfig<string>;
    taskHandlerResult?: TaskHandlerResult<string>;
    taskID: string;
    taskSlug: string;
    taskStatus: null | SingleTaskStatus<string>;
    updateJob: UpdateJobFunction;
}): Promise<never>;
export type TaskParent = {
    taskID: string;
    taskSlug: string;
};
export declare const getRunTaskFunction: <TIsInline extends boolean>(state: RunTaskFunctionState, job: BaseJob, workflowConfig: WorkflowConfig<string>, req: PayloadRequest, isInline: TIsInline, updateJob: UpdateJobFunction, parent?: TaskParent) => TIsInline extends true ? RunInlineTaskFunction : RunTaskFunctions;
//# sourceMappingURL=getRunTaskFunction.d.ts.map