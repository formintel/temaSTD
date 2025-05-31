import { status as httpStatus } from 'http-status';
import { APIError } from '../../errors/index.js';
export const logoutOperation = async (incomingArgs)=>{
    let args = incomingArgs;
    const { collection: { config: collectionConfig }, req: { user }, req } = incomingArgs;
    if (!user) {
        throw new APIError('No User', httpStatus.BAD_REQUEST);
    }
    if (user.collection !== collectionConfig.slug) {
        throw new APIError('Incorrect collection', httpStatus.FORBIDDEN);
    }
    if (collectionConfig.hooks?.afterLogout?.length) {
        for (const hook of collectionConfig.hooks.afterLogout){
            args = await hook({
                collection: args.collection?.config,
                context: req.context,
                req
            }) || args;
        }
    }
    return true;
};

//# sourceMappingURL=logout.js.map