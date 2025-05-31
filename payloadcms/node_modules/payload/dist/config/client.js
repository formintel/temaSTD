// @ts-strict-ignore
import { createClientCollectionConfigs } from '../collections/config/client.js';
import { createClientBlocks } from '../fields/config/client.js';
import { createClientGlobalConfigs } from '../globals/config/client.js';
export const serverOnlyAdminConfigProperties = [];
export const serverOnlyConfigProperties = [
    'endpoints',
    'db',
    'editor',
    'plugins',
    'sharp',
    'onInit',
    'secret',
    'hooks',
    'bin',
    'i18n',
    'typescript',
    'cors',
    'csrf',
    'email',
    'custom',
    'graphQL',
    'jobs',
    'logger',
    'queryPresets'
];
export const createClientConfig = ({ config, i18n, importMap })=>{
    const clientConfig = {};
    for(const key in config){
        if (serverOnlyConfigProperties.includes(key)) {
            continue;
        }
        switch(key){
            case 'admin':
                clientConfig.admin = {
                    autoLogin: config.admin.autoLogin,
                    avatar: config.admin.avatar,
                    custom: config.admin.custom,
                    dateFormat: config.admin.dateFormat,
                    importMap: config.admin.importMap,
                    meta: config.admin.meta,
                    routes: config.admin.routes,
                    theme: config.admin.theme,
                    timezones: config.admin.timezones,
                    user: config.admin.user
                };
                if (config.admin.livePreview) {
                    clientConfig.admin.livePreview = {};
                    if (config.admin.livePreview.breakpoints) {
                        clientConfig.admin.livePreview.breakpoints = config.admin.livePreview.breakpoints;
                    }
                }
                break;
            case 'blocks':
                {
                    ;
                    clientConfig.blocks = createClientBlocks({
                        blocks: config.blocks,
                        defaultIDType: config.db.defaultIDType,
                        i18n,
                        importMap
                    }).filter((block)=>typeof block !== 'string');
                    break;
                }
            case 'collections':
                ;
                clientConfig.collections = createClientCollectionConfigs({
                    collections: config.collections,
                    defaultIDType: config.db.defaultIDType,
                    i18n,
                    importMap
                });
                break;
            case 'globals':
                ;
                clientConfig.globals = createClientGlobalConfigs({
                    defaultIDType: config.db.defaultIDType,
                    globals: config.globals,
                    i18n,
                    importMap
                });
                break;
            case 'localization':
                if (typeof config.localization === 'object' && config.localization) {
                    clientConfig.localization = {};
                    if (config.localization.defaultLocale) {
                        clientConfig.localization.defaultLocale = config.localization.defaultLocale;
                    }
                    if (config.localization.defaultLocalePublishOption) {
                        clientConfig.localization.defaultLocalePublishOption = config.localization.defaultLocalePublishOption;
                    }
                    if (config.localization.fallback) {
                        clientConfig.localization.fallback = config.localization.fallback;
                    }
                    if (config.localization.localeCodes) {
                        clientConfig.localization.localeCodes = config.localization.localeCodes;
                    }
                    if (config.localization.locales) {
                        clientConfig.localization.locales = [];
                        for (const locale of config.localization.locales){
                            if (locale) {
                                const clientLocale = {};
                                if (locale.code) {
                                    clientLocale.code = locale.code;
                                }
                                if (locale.fallbackLocale) {
                                    clientLocale.fallbackLocale = locale.fallbackLocale;
                                }
                                if (locale.label) {
                                    clientLocale.label = locale.label;
                                }
                                if (locale.rtl) {
                                    clientLocale.rtl = locale.rtl;
                                }
                                clientConfig.localization.locales.push(clientLocale);
                            }
                        }
                    }
                }
                break;
            default:
                clientConfig[key] = config[key];
        }
    }
    return clientConfig;
};

//# sourceMappingURL=client.js.map