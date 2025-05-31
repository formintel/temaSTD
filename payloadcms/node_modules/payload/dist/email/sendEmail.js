import { getStringifiedToAddress } from './getStringifiedToAddress.js';
export async function sendEmail(message) {
    let result;
    try {
        result = await this.email.sendEmail(message);
    } catch (err) {
        const stringifiedTo = getStringifiedToAddress(message);
        this.logger.error({
            err,
            msg: `Failed to send mail to ${stringifiedTo}, subject: ${message.subject ?? 'No Subject'}`
        });
        return err;
    }
    return result;
}

//# sourceMappingURL=sendEmail.js.map