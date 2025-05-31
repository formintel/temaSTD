// @ts-strict-ignore
import { APIError } from '../../../errors/index.js';
import { createLocalReq } from '../../../utilities/createLocalReq.js';
import { forgotPasswordOperation } from '../forgotPassword.js';
async function localForgotPassword(payload, options) {
    const { collection: collectionSlug, data, disableEmail, expiration } = options;
    const collection = payload.collections[collectionSlug];
    if (!collection) {
        throw new APIError(`The collection with slug ${String(collectionSlug)} can't be found. Forgot Password Operation.`);
    }
    return forgotPasswordOperation({
        collection,
        data,
        disableEmail,
        expiration,
        req: await createLocalReq(options, payload)
    });
}
export const forgotPassword = localForgotPassword;

//# sourceMappingURL=forgotPassword.js.map