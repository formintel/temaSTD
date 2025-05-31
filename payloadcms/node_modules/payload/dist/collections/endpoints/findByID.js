// @ts-strict-ignore
import { status as httpStatus } from 'http-status';
import { getRequestCollectionWithID } from '../../utilities/getRequestEntity.js';
import { headersWithCors } from '../../utilities/headersWithCors.js';
import { isNumber } from '../../utilities/isNumber.js';
import { sanitizeJoinParams } from '../../utilities/sanitizeJoinParams.js';
import { sanitizePopulateParam } from '../../utilities/sanitizePopulateParam.js';
import { sanitizeSelectParam } from '../../utilities/sanitizeSelectParam.js';
import { findByIDOperation } from '../operations/findByID.js';
export const findByIDHandler = async (req)=>{
    const { searchParams } = req;
    const { id, collection } = getRequestCollectionWithID(req);
    const depth = searchParams.get('depth');
    const result = await findByIDOperation({
        id,
        collection,
        depth: isNumber(depth) ? Number(depth) : undefined,
        draft: searchParams.get('draft') === 'true',
        joins: sanitizeJoinParams(req.query.joins),
        populate: sanitizePopulateParam(req.query.populate),
        req,
        select: sanitizeSelectParam(req.query.select)
    });
    return Response.json(result, {
        headers: headersWithCors({
            headers: new Headers(),
            req
        }),
        status: httpStatus.OK
    });
};

//# sourceMappingURL=findByID.js.map