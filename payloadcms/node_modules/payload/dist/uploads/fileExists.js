import fs from 'fs/promises';
const fileExists = async (filename)=>{
    try {
        await fs.stat(filename);
        return true;
    } catch (err) {
        return false;
    }
};
export default fileExists;

//# sourceMappingURL=fileExists.js.map