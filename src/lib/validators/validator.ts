import { CasUser } from '../types';
import Cas20Validator from './cas-20-validator';
import Cas30Validator from './cas-30-validator';
import Saml11Validator from './saml-11-validator';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const casUrl = process.env.NEXT_PUBLIC_CAS_URL as string;

export interface Validator {
    path: string;
    service: string;
    redirectUrl?: string;
    validate(ticket: string): Promise<CasUser>;
}

export const validationUrl = (validator: Validator): string =>
    `${casUrl}/${validator.path}?${validator.service}=${encodeURIComponent(`${baseUrl}/api/cas/login`)}` +
    (validator.redirectUrl ? `&redirect=${encodeURIComponent(validator.redirectUrl)}` : '');

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
    static getValidator(type: ValidatorProtocol, redirectUrl?: string): Validator {
        switch (type) {
            case ValidatorProtocol.CAS20:
                return new Cas20Validator(redirectUrl);
            case ValidatorProtocol.CAS30:
                return new Cas30Validator(redirectUrl);
            case ValidatorProtocol.SAML11:
                return new Saml11Validator(redirectUrl);
        }
    }
}
