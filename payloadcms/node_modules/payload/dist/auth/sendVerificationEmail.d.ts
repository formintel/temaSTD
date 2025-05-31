import type { Collection } from '../collections/config/types.js';
import type { SanitizedConfig } from '../config/types.js';
import type { InitializedEmailAdapter } from '../email/types.js';
import type { PayloadRequest } from '../types/index.js';
import type { User } from './types.js';
type Args = {
    collection: Collection;
    config: SanitizedConfig;
    disableEmail: boolean;
    email: InitializedEmailAdapter;
    req: PayloadRequest;
    token: string;
    user: User;
};
export declare function sendVerificationEmail(args: Args): Promise<void>;
export {};
//# sourceMappingURL=sendVerificationEmail.d.ts.map