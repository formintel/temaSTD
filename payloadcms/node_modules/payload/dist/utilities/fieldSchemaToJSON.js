import { fieldAffectsData } from '../fields/config/types.js';
export const fieldSchemaToJSON = (fields, config)=>{
    return fields.reduce((acc, field)=>{
        let result = acc;
        switch(field.type){
            case 'array':
                acc.push({
                    name: field.name,
                    type: field.type,
                    fields: fieldSchemaToJSON([
                        ...field.fields,
                        {
                            name: 'id',
                            type: 'text'
                        }
                    ], config)
                });
                break;
            case 'blocks':
                acc.push({
                    name: field.name,
                    type: field.type,
                    blocks: (field.blockReferences ?? field.blocks).reduce((acc, _block)=>{
                        const block = typeof _block === 'string' ? config.blocksMap[_block] : _block;
                        acc[block.slug] = {
                            fields: fieldSchemaToJSON([
                                ...block.fields,
                                {
                                    name: 'id',
                                    type: 'text'
                                }
                            ], config)
                        };
                        return acc;
                    }, {})
                });
                break;
            case 'collapsible':
            case 'row':
                result = result.concat(fieldSchemaToJSON(field.fields, config));
                break;
            case 'group':
                if (fieldAffectsData(field)) {
                    acc.push({
                        name: field.name,
                        type: field.type,
                        fields: fieldSchemaToJSON(field.fields, config)
                    });
                } else {
                    result = result.concat(fieldSchemaToJSON(field.fields, config));
                }
                break;
            case 'relationship':
            case 'upload':
                acc.push({
                    name: field.name,
                    type: field.type,
                    hasMany: 'hasMany' in field ? Boolean(field.hasMany) : false,
                    relationTo: field.relationTo
                });
                break;
            case 'tabs':
                {
                    let tabFields = [];
                    field.tabs.forEach((tab)=>{
                        if ('name' in tab) {
                            tabFields.push({
                                name: tab.name,
                                type: field.type,
                                fields: fieldSchemaToJSON(tab.fields, config)
                            });
                            return;
                        }
                        tabFields = tabFields.concat(fieldSchemaToJSON(tab.fields, config));
                    });
                    result = result.concat(tabFields);
                    break;
                }
            default:
                if ('name' in field) {
                    acc.push({
                        name: field.name,
                        type: field.type
                    });
                }
        }
        return result;
    }, []);
};

//# sourceMappingURL=fieldSchemaToJSON.js.map