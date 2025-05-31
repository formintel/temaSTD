// @ts-strict-ignore
import { status as httpStatus } from 'http-status';
import executeAccess from '../../auth/executeAccess.js';
import { combineQueries } from '../../database/combineQueries.js';
import { APIError, Forbidden, NotFound } from '../../errors/index.js';
import { afterRead } from '../../fields/hooks/afterRead/index.js';
import { killTransaction } from '../../utilities/killTransaction.js';
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js';
import { buildVersionCollectionFields } from '../../versions/buildCollectionFields.js';
import { getQueryDraftsSelect } from '../../versions/drafts/getQueryDraftsSelect.js';
export const findVersionByIDOperation = async (args)=>{
    const { id, collection: { config: collectionConfig }, currentDepth, depth, disableErrors, overrideAccess, populate, req: { fallbackLocale, locale, payload }, req, select: incomingSelect, showHiddenFields } = args;
    if (!id) {
        throw new APIError('Missing ID of version.', httpStatus.BAD_REQUEST);
    }
    try {
        // /////////////////////////////////////
        // Access
        // /////////////////////////////////////
        const accessResults = !overrideAccess ? await executeAccess({
            id,
            disableErrors,
            req
        }, collectionConfig.access.readVersions) : true;
        // If errors are disabled, and access returns false, return null
        if (accessResults === false) {
            return null;
        }
        const hasWhereAccess = typeof accessResults === 'object';
        const fullWhere = combineQueries({
            id: {
                equals: id
            }
        }, accessResults);
        // /////////////////////////////////////
        // Find by ID
        // /////////////////////////////////////
        const select = sanitizeSelect({
            fields: buildVersionCollectionFields(payload.config, collectionConfig, true),
            forceSelect: getQueryDraftsSelect({
                select: collectionConfig.forceSelect
            }),
            select: incomingSelect,
            versions: true
        });
        const versionsQuery = await payload.db.findVersions({
            collection: collectionConfig.slug,
            limit: 1,
            locale,
            pagination: false,
            req,
            select,
            where: fullWhere
        });
        const result = versionsQuery.docs[0];
        if (!result) {
            if (!disableErrors) {
                if (!hasWhereAccess) {
                    throw new NotFound(req.t);
                }
                if (hasWhereAccess) {
                    throw new Forbidden(req.t);
                }
            }
            return null;
        }
        if (!result.version) {
            // Fallback if not selected
            ;
            result.version = {};
        }
        // /////////////////////////////////////
        // beforeRead - Collection
        // /////////////////////////////////////
        if (collectionConfig.hooks?.beforeRead?.length) {
            for (const hook of collectionConfig.hooks.beforeRead){
                result.version = await hook({
                    collection: collectionConfig,
                    context: req.context,
                    doc: result.version,
                    query: fullWhere,
                    req
                }) || result.version;
            }
        }
        // /////////////////////////////////////
        // afterRead - Fields
        // /////////////////////////////////////
        result.version = await afterRead({
            collection: collectionConfig,
            context: req.context,
            currentDepth,
            depth,
            doc: result.version,
            draft: undefined,
            fallbackLocale,
            global: null,
            locale,
            overrideAccess,
            populate,
            req,
            select: typeof select?.version === 'object' ? select.version : undefined,
            showHiddenFields
        });
        // /////////////////////////////////////
        // afterRead - Collection
        // /////////////////////////////////////
        if (collectionConfig.hooks?.afterRead?.length) {
            for (const hook of collectionConfig.hooks.afterRead){
                result.version = await hook({
                    collection: collectionConfig,
                    context: req.context,
                    doc: result.version,
                    query: fullWhere,
                    req
                }) || result.version;
            }
        }
        // /////////////////////////////////////
        // Return results
        // /////////////////////////////////////
        return result;
    } catch (error) {
        await killTransaction(req);
        throw error;
    }
};

//# sourceMappingURL=findVersionByID.js.map