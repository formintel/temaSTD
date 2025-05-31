// @ts-strict-ignore
import { APIError } from '../../../errors/index.js';
import { createLocalReq } from '../../../utilities/createLocalReq.js';
import { countGlobalVersionsOperation } from '../countGlobalVersions.js';
// eslint-disable-next-line no-restricted-exports
export default async function countGlobalVersionsLocal(payload, options) {
    const { disableErrors, global: globalSlug, overrideAccess = true, where } = options;
    const global = payload.globals.config.find(({ slug })=>slug === globalSlug);
    if (!global) {
        throw new APIError(`The global with slug ${String(globalSlug)} can't be found. Count Global Versions Operation.`);
    }
    return countGlobalVersionsOperation({
        disableErrors,
        global,
        overrideAccess,
        req: await createLocalReq(options, payload),
        where
    });
}

//# sourceMappingURL=countGlobalVersions.js.map