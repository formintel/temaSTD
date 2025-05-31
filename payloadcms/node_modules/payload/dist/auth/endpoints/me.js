// @ts-strict-ignore
import { status as httpStatus } from 'http-status';
import { getRequestCollection } from '../../utilities/getRequestEntity.js';
import { headersWithCors } from '../../utilities/headersWithCors.js';
import { extractJWT } from '../extractJWT.js';
import { meOperation } from '../operations/me.js';
export const meHandler = async (req)=>{
    const collection = getRequestCollection(req);
    const currentToken = extractJWT(req);
    const result = await meOperation({
        collection,
        currentToken,
        req
    });
    if (collection.config.auth.removeTokenFromResponses) {
        delete result.token;
    }
    return Response.json({
        ...result,
        message: req.t('authentication:account')
    }, {
        headers: headersWithCors({
            headers: new Headers(),
            req
        }),
        status: httpStatus.OK
    });
};

//# sourceMappingURL=me.js.map