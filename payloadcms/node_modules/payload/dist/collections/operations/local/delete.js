// @ts-strict-ignore
import { APIError } from '../../../errors/index.js';
import { createLocalReq } from '../../../utilities/createLocalReq.js';
import { deleteOperation } from '../delete.js';
import { deleteByIDOperation } from '../deleteByID.js';
async function deleteLocal(payload, options) {
    const { id, collection: collectionSlug, depth, disableTransaction, overrideAccess = true, overrideLock, populate, select, showHiddenFields, where } = options;
    const collection = payload.collections[collectionSlug];
    if (!collection) {
        throw new APIError(`The collection with slug ${String(collectionSlug)} can't be found. Delete Operation.`);
    }
    const args = {
        id,
        collection,
        depth,
        disableTransaction,
        overrideAccess,
        overrideLock,
        populate,
        req: await createLocalReq(options, payload),
        select,
        showHiddenFields,
        where
    };
    if (options.id) {
        return deleteByIDOperation(args);
    }
    return deleteOperation(args);
}
export default deleteLocal;

//# sourceMappingURL=delete.js.map