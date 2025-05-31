// @ts-strict-ignore
import { commitTransaction } from '../../utilities/commitTransaction.js';
import { getEntityPolicies } from '../../utilities/getEntityPolicies.js';
import { initTransaction } from '../../utilities/initTransaction.js';
import { killTransaction } from '../../utilities/killTransaction.js';
import { sanitizePermissions } from '../../utilities/sanitizePermissions.js';
export const docAccessOperation = async (args)=>{
    const { globalConfig, req } = args;
    const globalOperations = [
        'read',
        'update'
    ];
    if (globalConfig.versions) {
        globalOperations.push('readVersions');
    }
    try {
        const shouldCommit = await initTransaction(req);
        const result = await getEntityPolicies({
            type: 'global',
            blockPolicies: {},
            entity: globalConfig,
            operations: globalOperations,
            req
        });
        if (shouldCommit) {
            await commitTransaction(req);
        }
        const sanitizedPermissions = sanitizePermissions({
            globals: {
                [globalConfig.slug]: result
            }
        });
        return sanitizedPermissions?.globals?.[globalConfig.slug];
    } catch (e) {
        await killTransaction(req);
        throw e;
    }
};

//# sourceMappingURL=docAccess.js.map