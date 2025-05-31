import type { PayloadRequest, Sort, Where } from '../../types/index.js';
import type { BaseJob } from '../config/types/workflowTypes.js';
type BaseArgs = {
    data: Partial<BaseJob>;
    depth?: number;
    disableTransaction?: boolean;
    limit?: number;
    req: PayloadRequest;
    returning?: boolean;
};
type ArgsByID = {
    id: number | string;
    limit?: never;
    sort?: never;
    where?: never;
};
type ArgsWhere = {
    id?: never;
    limit?: number;
    sort?: Sort;
    where: Where;
};
type RunJobsArgs = (ArgsByID | ArgsWhere) & BaseArgs;
/**
 * Convenience method for updateJobs by id
 */
export declare function updateJob(args: ArgsByID & BaseArgs): Promise<BaseJob>;
export declare function updateJobs({ id, data, depth, disableTransaction, limit: limitArg, req, returning, sort, where: whereArg, }: RunJobsArgs): Promise<BaseJob[] | null>;
export {};
//# sourceMappingURL=updateJob.d.ts.map