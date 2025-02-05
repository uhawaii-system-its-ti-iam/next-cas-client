import { beforeEach, describe, expect, it, vi } from 'vitest';
import Saml11Validator from '@/lib/validators/saml-11-validator';
import { loadResourceXML } from '../../vitest.setup';

describe('Saml11Validator', () => {
    const saml11Validator = new Saml11Validator();

    const saml11ValidationSuccess = loadResourceXML('saml-11-validation-success.xml');
    const saml11ValidationFailure = loadResourceXML('saml-11-validation-failure.xml');
    const casUser = {
        user: 'testPrincipal',
        attributes: {
            samlAuthenticationStatementAuthMethod: 'urn:ietf:rfc:2246',
            testAttribute: 'testValue',
            testAttributeCollection: ['tac1', 'tac2'],
            testSamlAttribute: 'value'
        }
    };

    describe('validate', () => {
        beforeEach(() => {
            vi.setSystemTime(new Date('2017-08-15T06:30:04.700Z'));
        });

        it('should return the CAS user', async () => {
            fetchMock.mockResponse(saml11ValidationSuccess);
            expect(await saml11Validator.validate('ticket')).toEqual(casUser);
        });

        it('should throw an error', async () => {
            fetchMock.mockAbort();
            await expect(saml11Validator.validate('ticket')).rejects.toThrow();

            fetchMock.mockResponse(saml11ValidationFailure);
            await expect(saml11Validator.validate('ticket')).rejects.toThrow();
        });

        it('should adhere to the SAML tolerance', async () => {
            process.env.SAML_TOLERANCE = '1000';
            fetchMock.mockResponse(saml11ValidationSuccess);

            vi.setSystemTime(new Date('2017-08-15T06:30:04.700Z'));
            expect(await saml11Validator.validate('ticket')).toEqual(casUser);

            vi.setSystemTime(new Date('2017-08-15T06:30:03.622Z'));
            await expect(saml11Validator.validate('ticket')).rejects.toThrow();

            vi.setSystemTime(new Date('2017-08-15T06:30:06.622Z'));
            await expect(saml11Validator.validate('ticket')).rejects.toThrow();
        });
    });
});
