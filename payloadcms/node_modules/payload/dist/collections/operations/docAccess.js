// @ts-strict-ignore
import { getEntityPolicies } from '../../utilities/getEntityPolicies.js';
import { killTransaction } from '../../utilities/killTransaction.js';
import { sanitizePermissions } from '../../utilities/sanitizePermissions.js';
const allOperations = [
    'create',
    'read',
    'update',
    'delete'
];
export async function docAccessOperation(args) {
    const { id, collection: { config }, req } = args;
    const collectionOperations = [
        ...allOperations
    ];
    if (config.auth && typeof config.auth.maxLoginAttempts !== 'undefined' && config.auth.maxLoginAttempts !== 0) {
        collectionOperations.push('unlock');
    }
    if (config.versions) {
        collectionOperations.push('readVersions');
    }
    try {
        const result = await getEntityPolicies({
            id,
            type: 'collection',
            blockPolicies: {},
            entity: config,
            operations: collectionOperations,
            req
        });
        const sanitizedPermissions = sanitizePermissions({
            collections: {
                [config.slug]: result
            }
        });
        return sanitizedPermissions?.collections?.[config.slug];
    } catch (e) {
        await killTransaction(req);
        throw e;
    }
}

//# sourceMappingURL=docAccess.js.map