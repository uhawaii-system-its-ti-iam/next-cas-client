import { CasUser } from '../types';
import Cas20Validator from './cas-20-validator';
import Cas30Validator from './cas-30-validator';
import Saml11Validator from './saml-11-validator';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const casUrl = process.env.NEXT_PUBLIC_CAS_URL as string;

export interface Validator {
    path: string;
    service: string;
    validate(ticket: string): Promise<CasUser>;
}

export const validationUrl = (validator: Validator): string =>
    `${casUrl}/${validator.path}?${validator.service}=${encodeURIComponent(`${baseUrl}/api/cas/login`)}`;

/**
 * The validator protocol.
 * CAS20 for CAS 2.0, CAS30 for CAS 3.0, SAML11 for SAML 1.1.
 */
export enum ValidatorProtocol {
    CAS20,
    CAS30,
    SAML11
}

export class ValidatorFactory {
    static getValidator(type: ValidatorProtocol) {
        switch (type) {
            case ValidatorProtocol.CAS20:
                return new Cas20Validator();
            case ValidatorProtocol.CAS30:
                return new Cas30Validator();
            case ValidatorProtocol.SAML11:
                return new Saml11Validator();
        }
    }
}
