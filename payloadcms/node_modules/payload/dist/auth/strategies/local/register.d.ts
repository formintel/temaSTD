import type { SanitizedCollectionConfig } from '../../../collections/config/types.js';
import type { JsonObject, Payload } from '../../../index.js';
import type { PayloadRequest, SelectType } from '../../../types/index.js';
type Args = {
    collection: SanitizedCollectionConfig;
    doc: JsonObject;
    password: string;
    payload: Payload;
    req: PayloadRequest;
    select?: SelectType;
};
export declare const registerLocalStrategy: ({ collection, doc, password, payload, req, select, }: Args) => Promise<Record<string, unknown>>;
export {};
//# sourceMappingURL=register.d.ts.map