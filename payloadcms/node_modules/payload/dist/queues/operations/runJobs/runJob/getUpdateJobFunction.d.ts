import type { PayloadRequest } from '../../../../types/index.js';
import type { BaseJob } from '../../../config/types/workflowTypes.js';
export type UpdateJobFunction = (jobData: Partial<BaseJob>) => Promise<BaseJob>;
export declare function getUpdateJobFunction(job: BaseJob, req: PayloadRequest): UpdateJobFunction;
//# sourceMappingURL=getUpdateJobFunction.d.ts.map