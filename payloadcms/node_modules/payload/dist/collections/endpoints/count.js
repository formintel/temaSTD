import { status as httpStatus } from 'http-status';
import { getRequestCollection } from '../../utilities/getRequestEntity.js';
import { countOperation } from '../operations/count.js';
export const countHandler = async (req)=>{
    const collection = getRequestCollection(req);
    const { where } = req.query;
    const result = await countOperation({
        collection,
        req,
        where
    });
    return Response.json(result, {
        status: httpStatus.OK
    });
};

//# sourceMappingURL=count.js.map