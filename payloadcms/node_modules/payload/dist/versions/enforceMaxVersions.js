// @ts-strict-ignore
export const enforceMaxVersions = async ({ id, collection, global, max, payload, req })=>{
    const entityType = collection ? 'collection' : 'global';
    const slug = collection ? collection.slug : global?.slug;
    try {
        const where = {};
        let oldestAllowedDoc;
        if (collection) {
            where.parent = {
                equals: id
            };
            const query = await payload.db.findVersions({
                collection: collection.slug,
                limit: 1,
                pagination: false,
                req,
                skip: max,
                sort: '-updatedAt',
                where
            });
            [oldestAllowedDoc] = query.docs;
        } else if (global) {
            const query = await payload.db.findGlobalVersions({
                global: global.slug,
                limit: 1,
                pagination: false,
                req,
                skip: max,
                sort: '-updatedAt',
                where
            });
            [oldestAllowedDoc] = query.docs;
        }
        if (oldestAllowedDoc?.updatedAt) {
            const deleteQuery = {
                updatedAt: {
                    less_than_equal: oldestAllowedDoc.updatedAt
                }
            };
            if (collection) {
                deleteQuery.parent = {
                    equals: id
                };
            }
            await payload.db.deleteVersions({
                collection: slug,
                req,
                where: deleteQuery
            });
        }
    } catch (err) {
        payload.logger.error(`There was an error cleaning up old versions for the ${entityType} ${slug}`);
    }
};

//# sourceMappingURL=enforceMaxVersions.js.map