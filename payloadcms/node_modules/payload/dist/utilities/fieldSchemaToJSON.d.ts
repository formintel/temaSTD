import type { ClientConfig } from '../config/client.js';
import type { ClientField } from '../fields/config/client.js';
import { type FieldTypes } from '../fields/config/types.js';
export type FieldSchemaJSON = {
    blocks?: FieldSchemaJSON;
    fields?: FieldSchemaJSON;
    hasMany?: boolean;
    name: string;
    relationTo?: string;
    slug?: string;
    type: FieldTypes;
}[];
export declare const fieldSchemaToJSON: (fields: ClientField[], config: ClientConfig) => FieldSchemaJSON;
//# sourceMappingURL=fieldSchemaToJSON.d.ts.map