import { CasUser } from '../types';
import { validate } from './cas-validator';
import { validationUrl, Validator } from './validator';

class Cas30Validator implements Validator {
    path = 'p3/serviceValidate';
    service = 'service';

    async validate(ticket: string): Promise<CasUser> {
        return await validate(validationUrl(this), ticket);
    }
}

export default Cas30Validator;
