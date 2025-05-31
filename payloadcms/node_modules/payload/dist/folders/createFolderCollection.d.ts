import type { CollectionConfig } from '../collections/config/types.js';
type CreateFolderCollectionArgs = {
    collectionSlugs: string[];
    debug?: boolean;
    folderFieldName: string;
    slug: string;
};
export declare const createFolderCollection: ({ slug, collectionSlugs, debug, folderFieldName, }: CreateFolderCollectionArgs) => CollectionConfig;
export {};
//# sourceMappingURL=createFolderCollection.d.ts.map