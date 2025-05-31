import type { User } from '../auth/types.js';
import type { Payload, RequestContext, TypedLocale } from '../index.js';
import type { PayloadRequest } from '../types/index.js';
type CreateLocalReq = (options: {
    context?: RequestContext;
    fallbackLocale?: false | TypedLocale;
    locale?: string;
    req?: Partial<PayloadRequest>;
    urlSuffix?: string;
    user?: User;
}, payload: Payload) => Promise<PayloadRequest>;
export declare const createLocalReq: CreateLocalReq;
export {};
//# sourceMappingURL=createLocalReq.d.ts.map