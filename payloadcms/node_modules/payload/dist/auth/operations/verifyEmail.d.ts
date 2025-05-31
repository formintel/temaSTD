import type { Collection } from '../../collections/config/types.js';
import type { PayloadRequest } from '../../types/index.js';
export type Args = {
    collection: Collection;
    req: PayloadRequest;
    token: string;
};
export declare const verifyEmailOperation: (args: Args) => Promise<boolean>;
export default verifyEmailOperation;
//# sourceMappingURL=verifyEmail.d.ts.map