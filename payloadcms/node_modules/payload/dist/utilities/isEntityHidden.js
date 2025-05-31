// @ts-strict-ignore
export const isEntityHidden = ({ hidden, user })=>{
    return typeof hidden === 'function' ? hidden({
        user
    }) : hidden === true;
};

//# sourceMappingURL=isEntityHidden.js.map