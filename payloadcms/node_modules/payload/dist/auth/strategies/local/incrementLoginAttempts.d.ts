import type { SanitizedCollectionConfig, TypeWithID } from '../../../collections/config/types.js';
import type { Payload } from '../../../index.js';
import type { PayloadRequest } from '../../../types/index.js';
type Args = {
    collection: SanitizedCollectionConfig;
    doc: Record<string, unknown> & TypeWithID;
    payload: Payload;
    req: PayloadRequest;
};
export declare const incrementLoginAttempts: ({ collection, doc, payload, req, }: Args) => Promise<void>;
export {};
//# sourceMappingURL=incrementLoginAttempts.d.ts.map