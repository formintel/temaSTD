export function combineWhereConstraints(constraints, as = 'and') {
    if (constraints.length === 0) {
        return {};
    }
    return {
        [as]: constraints.filter((constraint)=>{
            if (constraint && typeof constraint === 'object' && Object.keys(constraint).length > 0) {
                return true;
            }
            return false;
        })
    };
}

//# sourceMappingURL=combineWhereConstraints.js.map