import type { CollectionSlug, Payload, RequestContext } from '../../../index.js';
import type { PayloadRequest } from '../../../types/index.js';
import type { Result } from '../resetPassword.js';
export type Options<T extends CollectionSlug> = {
    collection: T;
    context?: RequestContext;
    data: {
        password: string;
        token: string;
    };
    overrideAccess: boolean;
    req?: Partial<PayloadRequest>;
};
declare function localResetPassword<TSlug extends CollectionSlug>(payload: Payload, options: Options<TSlug>): Promise<Result>;
export declare const resetPassword: typeof localResetPassword;
export {};
//# sourceMappingURL=resetPassword.d.ts.map