// @ts-strict-ignore
import executeAccess from '../../auth/executeAccess.js';
import { combineQueries } from '../../database/combineQueries.js';
import { validateQueryPaths } from '../../database/queryValidation/validateQueryPaths.js';
import { killTransaction } from '../../utilities/killTransaction.js';
import { buildAfterOperation } from './utils.js';
export const countOperation = async (incomingArgs)=>{
    let args = incomingArgs;
    try {
        // /////////////////////////////////////
        // beforeOperation - Collection
        // /////////////////////////////////////
        if (args.collection.config.hooks?.beforeOperation?.length) {
            for (const hook of args.collection.config.hooks.beforeOperation){
                args = await hook({
                    args,
                    collection: args.collection.config,
                    context: args.req.context,
                    operation: 'count',
                    req: args.req
                }) || args;
            }
        }
        const { collection: { config: collectionConfig }, disableErrors, overrideAccess, req: { payload }, req, where } = args;
        // /////////////////////////////////////
        // Access
        // /////////////////////////////////////
        let accessResult;
        if (!overrideAccess) {
            accessResult = await executeAccess({
                disableErrors,
                req
            }, collectionConfig.access.read);
            // If errors are disabled, and access returns false, return empty results
            if (accessResult === false) {
                return {
                    totalDocs: 0
                };
            }
        }
        let result;
        const fullWhere = combineQueries(where, accessResult);
        await validateQueryPaths({
            collectionConfig,
            overrideAccess,
            req,
            where
        });
        result = await payload.db.count({
            collection: collectionConfig.slug,
            req,
            where: fullWhere
        });
        // /////////////////////////////////////
        // afterOperation - Collection
        // /////////////////////////////////////
        result = await buildAfterOperation({
            args,
            collection: collectionConfig,
            operation: 'count',
            result
        });
        // /////////////////////////////////////
        // Return results
        // /////////////////////////////////////
        return result;
    } catch (error) {
        await killTransaction(args.req);
        throw error;
    }
};

//# sourceMappingURL=count.js.map