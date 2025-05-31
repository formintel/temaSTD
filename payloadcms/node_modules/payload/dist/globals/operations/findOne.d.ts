import type { PayloadRequest, PopulateType, SelectType } from '../../types/index.js';
import type { SanitizedGlobalConfig } from '../config/types.js';
type Args = {
    depth?: number;
    draft?: boolean;
    globalConfig: SanitizedGlobalConfig;
    includeLockStatus?: boolean;
    overrideAccess?: boolean;
    populate?: PopulateType;
    req: PayloadRequest;
    select?: SelectType;
    showHiddenFields?: boolean;
    slug: string;
};
export declare const findOneOperation: <T extends Record<string, unknown>>(args: Args) => Promise<T>;
export {};
//# sourceMappingURL=findOne.d.ts.map