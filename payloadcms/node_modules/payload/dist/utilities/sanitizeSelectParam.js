// @ts-strict-ignore
/**
 * Sanitizes REST select query to SelectType
 */ export const sanitizeSelectParam = (unsanitizedSelect)=>{
    if (unsanitizedSelect && typeof unsanitizedSelect === 'object') {
        for(const k in unsanitizedSelect){
            if (unsanitizedSelect[k] === 'true') {
                unsanitizedSelect[k] = true;
            } else if (unsanitizedSelect[k] === 'false') {
                unsanitizedSelect[k] = false;
            } else if (typeof unsanitizedSelect[k] === 'object') {
                sanitizeSelectParam(unsanitizedSelect[k]);
            }
        }
    }
    return unsanitizedSelect;
};

//# sourceMappingURL=sanitizeSelectParam.js.map