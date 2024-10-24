import Cas30Validator from '@/lib/validators/cas-30-validator';
import { loadResourceJSON } from '../../setup-jest';
import { CasValidationResponse } from '@/lib/validators/cas-validator';

describe('Cas30Validator', () => {
    const cas30Validator = new Cas30Validator();

    const casValidationSuccess = loadResourceJSON('cas-validation-success.json') as CasValidationResponse;
    const casValidationFailure = loadResourceJSON('cas-validation-failure.json') as CasValidationResponse;

    // @ts-expect-error casValidationSuccess is of type authenticationSuccess
    const { user, attributes } = casValidationSuccess.serviceResponse.authenticationSuccess;
    const casUser = { user, attributes };

    describe('validate', () => {
        it('should return the CAS user', async () => {
            fetchMock.mockResponse(JSON.stringify(casValidationSuccess));
            expect(await cas30Validator.validate('ticket')).toEqual(casUser);
        });

        it('should throw an error', async () => {
            fetchMock.mockAbort();
            await expect(cas30Validator.validate('ticket')).rejects.toThrow();

            fetchMock.mockResponse(JSON.stringify(casValidationFailure));
            await expect(cas30Validator.validate('ticket')).rejects.toThrow();
        });
    });
});
