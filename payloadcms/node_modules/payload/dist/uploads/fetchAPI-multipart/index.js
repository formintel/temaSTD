// @ts-strict-ignore
import path from 'path';
import { APIError } from '../../errors/APIError.js';
import { isEligibleRequest } from './isEligibleRequest.js';
import { processMultipart } from './processMultipart.js';
import { debugLog } from './utilities.js';
const DEFAULT_OPTIONS = {
    abortOnLimit: false,
    createParentPath: false,
    debug: false,
    defParamCharset: 'utf8',
    limitHandler: false,
    parseNested: false,
    preserveExtension: false,
    responseOnLimit: 'File size limit has been reached',
    safeFileNames: false,
    tempFileDir: path.join(process.cwd(), 'tmp'),
    uploadTimeout: 60000,
    uriDecodeFileNames: false,
    useTempFiles: false
};
export const fetchAPIFileUpload = async ({ options, request })=>{
    const uploadOptions = {
        ...DEFAULT_OPTIONS,
        ...options
    };
    if (!isEligibleRequest(request)) {
        debugLog(uploadOptions, 'Request is not eligible for file upload!');
        return {
            error: new APIError('Request is not eligible for file upload', 500),
            fields: undefined,
            files: undefined
        };
    } else {
        return processMultipart({
            options: uploadOptions,
            request
        });
    }
};

//# sourceMappingURL=index.js.map