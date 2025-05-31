import type { AuthOperationsFromCollectionSlug, CollectionSlug, DataFromCollectionSlug, Payload, RequestContext } from '../../../index.js';
import type { PayloadRequest } from '../../../types/index.js';
import type { Result } from '../login.js';
export type Options<TSlug extends CollectionSlug> = {
    collection: TSlug;
    context?: RequestContext;
    data: AuthOperationsFromCollectionSlug<TSlug>['login'];
    depth?: number;
    fallbackLocale?: string;
    locale?: string;
    overrideAccess?: boolean;
    req?: Partial<PayloadRequest>;
    showHiddenFields?: boolean;
};
export declare function localLogin<TSlug extends CollectionSlug>(payload: Payload, options: Options<TSlug>): Promise<{
    user: DataFromCollectionSlug<TSlug>;
} & Result>;
export declare const login: typeof localLogin;
//# sourceMappingURL=login.d.ts.map