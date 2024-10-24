import Cas20Validator from '@/lib/validators/cas-20-validator';
import Cas30Validator from '@/lib/validators/cas-30-validator';
import Saml11Validator from '@/lib/validators/saml-11-validator';
import { validationUrl, ValidatorFactory, ValidatorProtocol } from '@/lib/validators/validator';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const casUrl = process.env.NEXT_PUBLIC_CAS_URL as string;

describe('ValidatorFactory', () => {
    describe('getValidator', () => {
        it('should return the correct validator', () => {
            expect(ValidatorFactory.getValidator(ValidatorProtocol.CAS20)).toStrictEqual(new Cas20Validator());
            expect(ValidatorFactory.getValidator(ValidatorProtocol.CAS30)).toStrictEqual(new Cas30Validator());
            expect(ValidatorFactory.getValidator(ValidatorProtocol.SAML11)).toStrictEqual(new Saml11Validator());
        });
    });
});

describe('validationUrl', () => {
    it('should return the correct URL', () => {
        const cas20Validator = new Cas20Validator();
        expect(validationUrl(cas20Validator)).toBe(
            `${casUrl}/${cas20Validator.path}?${cas20Validator.service}=${encodeURIComponent(`${baseUrl}/api/cas/login`)}`
        );

        const cas30Validator = new Cas30Validator();
        expect(validationUrl(cas30Validator)).toBe(
            `${casUrl}/${cas30Validator.path}?${cas30Validator.service}=${encodeURIComponent(`${baseUrl}/api/cas/login`)}`
        );

        const saml11Validator = new Saml11Validator();
        expect(validationUrl(saml11Validator)).toBe(
            `${casUrl}/${saml11Validator.path}?${saml11Validator.service}=${encodeURIComponent(`${baseUrl}/api/cas/login`)}`
        );
    });
});
