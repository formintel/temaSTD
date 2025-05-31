import type { AuthOperationsFromCollectionSlug, CollectionSlug, Payload, RequestContext } from '../../../index.js';
import type { PayloadRequest } from '../../../types/index.js';
export type Options<TSlug extends CollectionSlug> = {
    collection: TSlug;
    context?: RequestContext;
    data: AuthOperationsFromCollectionSlug<TSlug>['unlock'];
    overrideAccess: boolean;
    req?: Partial<PayloadRequest>;
};
declare function localUnlock<TSlug extends CollectionSlug>(payload: Payload, options: Options<TSlug>): Promise<boolean>;
export declare const unlock: typeof localUnlock;
export {};
//# sourceMappingURL=unlock.d.ts.map