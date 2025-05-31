// @ts-strict-ignore
import crypto from 'crypto';
export const APIKeyAuthentication = (collectionConfig)=>async ({ headers, payload })=>{
        const authHeader = headers.get('Authorization');
        if (authHeader?.startsWith(`${collectionConfig.slug} API-Key `)) {
            const apiKey = authHeader.replace(`${collectionConfig.slug} API-Key `, '');
            const apiKeyIndex = crypto.createHmac('sha1', payload.secret).update(apiKey).digest('hex');
            try {
                const where = {};
                if (collectionConfig.auth?.verify) {
                    where.and = [
                        {
                            apiKeyIndex: {
                                equals: apiKeyIndex
                            }
                        },
                        {
                            _verified: {
                                not_equals: false
                            }
                        }
                    ];
                } else {
                    where.apiKeyIndex = {
                        equals: apiKeyIndex
                    };
                }
                const userQuery = await payload.find({
                    collection: collectionConfig.slug,
                    depth: collectionConfig.auth.depth,
                    limit: 1,
                    overrideAccess: true,
                    pagination: false,
                    where
                });
                if (userQuery.docs && userQuery.docs.length > 0) {
                    const user = userQuery.docs[0];
                    user.collection = collectionConfig.slug;
                    user._strategy = 'api-key';
                    return {
                        user: user
                    };
                }
            } catch (err) {
                return {
                    user: null
                };
            }
        }
        return {
            user: null
        };
    };

//# sourceMappingURL=apiKey.js.map