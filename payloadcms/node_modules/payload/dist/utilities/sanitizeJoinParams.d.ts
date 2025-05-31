import type { JoinQuery } from '../types/index.js';
/**
 * Convert request JoinQuery object from strings to numbers
 * @param joins
 */
export declare const sanitizeJoinParams: (joins?: {
    [schemaPath: string]: {
        limit?: unknown;
        sort?: string;
        where?: unknown;
    } | false;
} | false) => JoinQuery;
//# sourceMappingURL=sanitizeJoinParams.d.ts.map