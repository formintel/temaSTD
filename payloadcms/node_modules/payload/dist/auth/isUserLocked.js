export const isUserLocked = (date)=>{
    if (!date) {
        return false;
    }
    return date > Date.now();
};

//# sourceMappingURL=isUserLocked.js.map