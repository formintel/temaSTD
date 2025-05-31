// @ts-strict-ignore
export const baseTimezoneField = ({ name, defaultValue, options, required })=>{
    return {
        name,
        type: 'select',
        admin: {
            hidden: true
        },
        defaultValue,
        options,
        required
    };
};

//# sourceMappingURL=baseField.js.map