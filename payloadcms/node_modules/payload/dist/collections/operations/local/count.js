// @ts-strict-ignore
import { APIError } from '../../../errors/index.js';
import { createLocalReq } from '../../../utilities/createLocalReq.js';
import { countOperation } from '../count.js';
// eslint-disable-next-line no-restricted-exports
export default async function countLocal(payload, options) {
    const { collection: collectionSlug, disableErrors, overrideAccess = true, where } = options;
    const collection = payload.collections[collectionSlug];
    if (!collection) {
        throw new APIError(`The collection with slug ${String(collectionSlug)} can't be found. Count Operation.`);
    }
    return countOperation({
        collection,
        disableErrors,
        overrideAccess,
        req: await createLocalReq(options, payload),
        where
    });
}

//# sourceMappingURL=count.js.map