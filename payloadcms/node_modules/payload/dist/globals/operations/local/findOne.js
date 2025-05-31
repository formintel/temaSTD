// @ts-strict-ignore
import { APIError } from '../../../errors/index.js';
import { createLocalReq } from '../../../utilities/createLocalReq.js';
import { findOneOperation } from '../findOne.js';
export default async function findOneLocal(payload, options) {
    const { slug: globalSlug, depth, draft = false, includeLockStatus, overrideAccess = true, populate, select, showHiddenFields } = options;
    const globalConfig = payload.globals.config.find((config)=>config.slug === globalSlug);
    if (!globalConfig) {
        throw new APIError(`The global with slug ${String(globalSlug)} can't be found.`);
    }
    return findOneOperation({
        slug: globalSlug,
        depth,
        draft,
        globalConfig,
        includeLockStatus,
        overrideAccess,
        populate,
        req: await createLocalReq(options, payload),
        select,
        showHiddenFields
    });
}

//# sourceMappingURL=findOne.js.map