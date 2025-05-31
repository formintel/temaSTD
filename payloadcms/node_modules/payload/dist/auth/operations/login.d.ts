import type { AuthOperationsFromCollectionSlug, Collection, DataFromCollectionSlug, SanitizedCollectionConfig } from '../../collections/config/types.js';
import type { CollectionSlug } from '../../index.js';
import type { PayloadRequest } from '../../types/index.js';
import type { User } from '../types.js';
export type Result = {
    exp?: number;
    token?: string;
    user?: User;
};
export type Arguments<TSlug extends CollectionSlug> = {
    collection: Collection;
    data: AuthOperationsFromCollectionSlug<TSlug>['login'];
    depth?: number;
    overrideAccess?: boolean;
    req: PayloadRequest;
    showHiddenFields?: boolean;
};
type CheckLoginPermissionArgs = {
    collection: SanitizedCollectionConfig;
    loggingInWithUsername?: boolean;
    req: PayloadRequest;
    user: any;
};
export declare const checkLoginPermission: ({ collection, loggingInWithUsername, req, user, }: CheckLoginPermissionArgs) => void;
export declare const loginOperation: <TSlug extends CollectionSlug>(incomingArgs: Arguments<TSlug>) => Promise<{
    user: DataFromCollectionSlug<TSlug>;
} & Result>;
export {};
//# sourceMappingURL=login.d.ts.map