import type { CollectionSlug, Payload, RequestContext } from '../../../index.js';
import type { PayloadRequest } from '../../../types/index.js';
export type Options<T extends CollectionSlug> = {
    collection: T;
    context?: RequestContext;
    req?: Partial<PayloadRequest>;
    token: string;
};
declare function localVerifyEmail<T extends CollectionSlug>(payload: Payload, options: Options<T>): Promise<boolean>;
export declare const verifyEmail: typeof localVerifyEmail;
export {};
//# sourceMappingURL=verifyEmail.d.ts.map