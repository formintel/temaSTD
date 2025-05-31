import type { I18nClient } from '@payloadcms/translations';
import type { ImportMap } from '../bin/generateImportMap/index.js';
import type { ClientBlock } from '../fields/config/types.js';
import type { BlockSlug } from '../index.js';
import type { LivePreviewConfig, SanitizedConfig, ServerOnlyLivePreviewProperties } from './types.js';
import { type ClientCollectionConfig } from '../collections/config/client.js';
import { type ClientGlobalConfig } from '../globals/config/client.js';
export type ServerOnlyRootProperties = keyof Pick<SanitizedConfig, 'bin' | 'cors' | 'csrf' | 'custom' | 'db' | 'editor' | 'email' | 'endpoints' | 'graphQL' | 'hooks' | 'i18n' | 'jobs' | 'logger' | 'onInit' | 'plugins' | 'queryPresets' | 'secret' | 'sharp' | 'typescript'>;
export type ServerOnlyRootAdminProperties = keyof Pick<SanitizedConfig['admin'], 'components'>;
export type UnsanitizedClientConfig = {
    admin: {
        livePreview?: Omit<LivePreviewConfig, ServerOnlyLivePreviewProperties>;
    } & Omit<SanitizedConfig['admin'], 'components' | 'dependencies' | 'livePreview'>;
    blocks: ClientBlock[];
    collections: ClientCollectionConfig[];
    custom?: Record<string, any>;
    globals: ClientGlobalConfig[];
} & Omit<SanitizedConfig, 'admin' | 'collections' | 'globals' | 'i18n' | ServerOnlyRootProperties>;
export type ClientConfig = {
    admin: {
        livePreview?: Omit<LivePreviewConfig, ServerOnlyLivePreviewProperties>;
    } & Omit<SanitizedConfig['admin'], 'components' | 'dependencies' | 'livePreview'>;
    blocks: ClientBlock[];
    blocksMap: Record<BlockSlug, ClientBlock>;
    collections: ClientCollectionConfig[];
    custom?: Record<string, any>;
    globals: ClientGlobalConfig[];
} & Omit<SanitizedConfig, 'admin' | 'collections' | 'globals' | 'i18n' | ServerOnlyRootProperties>;
export declare const serverOnlyAdminConfigProperties: readonly Partial<ServerOnlyRootAdminProperties>[];
export declare const serverOnlyConfigProperties: readonly Partial<ServerOnlyRootProperties>[];
export declare const createClientConfig: ({ config, i18n, importMap, }: {
    config: SanitizedConfig;
    i18n: I18nClient;
    importMap: ImportMap;
}) => ClientConfig;
//# sourceMappingURL=client.d.ts.map