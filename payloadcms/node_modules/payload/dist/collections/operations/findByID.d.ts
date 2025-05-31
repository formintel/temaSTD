import type { CollectionSlug, JoinQuery } from '../../index.js';
import type { ApplyDisableErrors, PayloadRequest, PopulateType, SelectType, TransformCollectionWithSelect } from '../../types/index.js';
import type { Collection, SelectFromCollectionSlug } from '../config/types.js';
export type Arguments = {
    collection: Collection;
    currentDepth?: number;
    depth?: number;
    disableErrors?: boolean;
    draft?: boolean;
    id: number | string;
    includeLockStatus?: boolean;
    joins?: JoinQuery;
    overrideAccess?: boolean;
    populate?: PopulateType;
    req: PayloadRequest;
    select?: SelectType;
    showHiddenFields?: boolean;
};
export declare const findByIDOperation: <TSlug extends CollectionSlug, TDisableErrors extends boolean, TSelect extends SelectFromCollectionSlug<TSlug>>(incomingArgs: Arguments) => Promise<ApplyDisableErrors<TransformCollectionWithSelect<TSlug, TSelect>, TDisableErrors>>;
//# sourceMappingURL=findByID.d.ts.map