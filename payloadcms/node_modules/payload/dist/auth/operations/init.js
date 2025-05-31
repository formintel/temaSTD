export const initOperation = async (args)=>{
    const { collection: slug, req } = args;
    const doc = await req.payload.db.findOne({
        collection: slug,
        req
    });
    return !!doc;
};

//# sourceMappingURL=init.js.map