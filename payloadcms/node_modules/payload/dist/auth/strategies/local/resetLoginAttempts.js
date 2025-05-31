export const resetLoginAttempts = async ({ collection, doc, payload, req })=>{
    if (!('lockUntil' in doc && typeof doc.lockUntil === 'string') || doc.loginAttempts === 0) {
        return;
    }
    await payload.update({
        id: doc.id,
        collection: collection.slug,
        data: {
            lockUntil: null,
            loginAttempts: 0
        },
        depth: 0,
        overrideAccess: true,
        req
    });
};

//# sourceMappingURL=resetLoginAttempts.js.map