import ObjectIdImport from 'bson-objectid';
const ObjectId = ObjectIdImport.default || ObjectIdImport;
export const baseIDField = {
    name: 'id',
    type: 'text',
    admin: {
        hidden: true
    },
    defaultValue: ()=>new ObjectId().toHexString(),
    hooks: {
        beforeChange: [
            ({ value })=>value || new ObjectId().toHexString()
        ],
        beforeDuplicate: [
            ()=>new ObjectId().toHexString()
        ]
    },
    label: 'ID'
};

//# sourceMappingURL=baseIDField.js.map