import type { CollectionConfig } from '../../collections/config/types.js';
import type { Config, SanitizedConfig } from '../../config/types.js';
import type { BaseJob } from './types/workflowTypes.js';
export declare const jobsCollectionSlug = "payload-jobs";
export declare const getDefaultJobsCollection: (config: Config) => CollectionConfig | null;
export declare function jobAfterRead({ config, doc }: {
    config: SanitizedConfig;
    doc: BaseJob;
}): BaseJob;
//# sourceMappingURL=index.d.ts.map