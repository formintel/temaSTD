import type { Collection } from '../../collections/config/types.js';
import type { PayloadRequest } from '../../types/index.js';
import type { ClientUser } from '../types.js';
export type MeOperationResult = {
    collection?: string;
    exp?: number;
    /** @deprecated
     * use:
     * ```ts
     * user._strategy
     * ```
     */
    strategy?: string;
    token?: string;
    user?: ClientUser;
};
export type Arguments = {
    collection: Collection;
    currentToken?: string;
    req: PayloadRequest;
};
export declare const meOperation: (args: Arguments) => Promise<MeOperationResult>;
//# sourceMappingURL=me.d.ts.map