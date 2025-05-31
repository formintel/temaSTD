// @ts-strict-ignore
import { APIError } from '../../../errors/index.js';
import { createLocalReq } from '../../../utilities/createLocalReq.js';
import { findVersionByIDOperation } from '../findVersionByID.js';
export default async function findVersionByIDLocal(payload, options) {
    const { id, collection: collectionSlug, depth, disableErrors = false, overrideAccess = true, populate, select, showHiddenFields } = options;
    const collection = payload.collections[collectionSlug];
    if (!collection) {
        throw new APIError(`The collection with slug ${String(collectionSlug)} can't be found. Find Version By ID Operation.`);
    }
    return findVersionByIDOperation({
        id,
        collection,
        depth,
        disableErrors,
        overrideAccess,
        populate,
        req: await createLocalReq(options, payload),
        select,
        showHiddenFields
    });
}

//# sourceMappingURL=findVersionByID.js.map