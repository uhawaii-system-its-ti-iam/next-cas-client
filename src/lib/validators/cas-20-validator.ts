import { CasUser } from '../types';
import { validate } from './cas-validator';
import { validationUrl, Validator } from './validator';

class Cas20Validator implements Validator {
    path = 'serviceValidate';
    service = 'service';
    redirectUrl?: string;
    constructor(redirectUrl?: string) {
        if (redirectUrl) {
            this.redirectUrl = redirectUrl;
        }
    }

    async validate(ticket: string): Promise<CasUser> {
        return await validate(validationUrl(this), ticket);
    }
}

export default Cas20Validator;
