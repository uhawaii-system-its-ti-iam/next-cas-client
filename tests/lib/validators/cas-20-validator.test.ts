import { describe, expect, it } from 'vitest';
import Cas20Validator from '@/lib/validators/cas-20-validator';
import { loadResourceJSON } from '../../vitest.setup';
import { CasValidationResponse } from '@/lib/validators/cas-validator';

describe('Cas20Validator', () => {
    const cas20Validator = new Cas20Validator();

    const casValidationSuccess = loadResourceJSON('cas-validation-success.json') as CasValidationResponse;
    const casValidationFailure = loadResourceJSON('cas-validation-failure.json') as CasValidationResponse;

    // @ts-expect-error casValidationSuccess is of type authenticationSuccess
    const { user, attributes } = casValidationSuccess.serviceResponse.authenticationSuccess;
    const casUser = { user, attributes };

    describe('validate', () => {
        it('should return the CAS user', async () => {
            fetchMock.mockResponse(JSON.stringify(casValidationSuccess));
            expect(await cas20Validator.validate('ticket')).toEqual(casUser);
        });

        it('should throw an error', async () => {
            fetchMock.mockAbort();
            await expect(cas20Validator.validate('ticket')).rejects.toThrow();

            fetchMock.mockResponse(JSON.stringify(casValidationFailure));
            await expect(cas20Validator.validate('ticket')).rejects.toThrow();
        });
    });
});
