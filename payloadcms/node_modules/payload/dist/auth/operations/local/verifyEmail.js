import { APIError } from '../../../errors/index.js';
import { createLocalReq } from '../../../utilities/createLocalReq.js';
import { verifyEmailOperation } from '../verifyEmail.js';
async function localVerifyEmail(payload, options) {
    const { collection: collectionSlug, token } = options;
    const collection = payload.collections[collectionSlug];
    if (!collection) {
        throw new APIError(`The collection with slug ${String(collectionSlug)} can't be found. Verify Email Operation.`);
    }
    return verifyEmailOperation({
        collection,
        req: await createLocalReq(options, payload),
        token
    });
}
export const verifyEmail = localVerifyEmail;

//# sourceMappingURL=verifyEmail.js.map