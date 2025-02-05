import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleAuth } from '@/lib/pages/handler';
import { ValidatorProtocol } from '@/lib/validators/validator';
import {
    createMockNextApiRequest,
    createMockNextApiResponse,
    createMockSession,
    loadResourceXML
} from '../../vitest.setup';
import * as IronSession from 'iron-session';
import { CasUser } from '@/lib/types';

describe('Handler', () => {
    const saml11ValidationSuccess = loadResourceXML('saml-11-validation-success.xml');
    const saml11ValidationFailure = loadResourceXML('saml-11-validation-failure.xml');

    describe('handleAuth', () => {
        const options = { validator: ValidatorProtocol.SAML11 };

        describe('login', () => {
            beforeEach(() => {
                vi.setSystemTime(new Date('2017-08-15T06:30:04.700Z'));
            });

            it('should save the session and redirect', async () => {
                const mockNextApiRequest = createMockNextApiRequest('login');
                const mockNextApiResponse = createMockNextApiResponse();

                fetchMock.mockResponse(saml11ValidationSuccess);
                const session = createMockSession();
                const sessionSaveSpy = vi.spyOn(session, 'save');
                vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);

                const handler = handleAuth(options);
                await handler(mockNextApiRequest, mockNextApiResponse);

                expect(sessionSaveSpy).toHaveBeenCalled();
                expect(mockNextApiResponse.redirect).toHaveBeenCalled();
            });

            it('should redirect and not set the session when validation is invalid', async () => {
                const mockNextApiRequest = createMockNextApiRequest('login');
                const mockNextApiResponse = createMockNextApiResponse();

                const session = createMockSession();
                const sessionSaveSpy = vi.spyOn(session, 'save');
                vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);

                // Invalid ticket
                fetchMock.mockResponse(saml11ValidationFailure);

                const handler = handleAuth(options);
                await expect(handler(mockNextApiRequest, mockNextApiResponse)).resolves.not.toThrow();
                expect(sessionSaveSpy).not.toHaveBeenCalled();
                expect(mockNextApiResponse.redirect).toHaveBeenCalled();

                // Request error
                fetchMock.mockAbort();

                await expect(handler(mockNextApiRequest, mockNextApiResponse)).resolves.not.toThrow();
                expect(sessionSaveSpy).not.toHaveBeenCalled();
                expect(mockNextApiResponse.redirect).toHaveBeenCalled();
            });

            it('should call loadUser when defined', async () => {
                const mockNextApiRequest = createMockNextApiRequest('login');
                const mockNextApiResponse = createMockNextApiResponse();

                fetchMock.mockResponse(saml11ValidationSuccess);
                const session = createMockSession();
                const sessionSaveSpy = vi.spyOn(session, 'save');
                vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);

                const user = { uid: 'testPrincipal' };
                const loadUser = (casUser: CasUser) => ({ uid: casUser.user });

                const handler = handleAuth({ loadUser, ...options });
                await handler(mockNextApiRequest, mockNextApiResponse);

                expect(sessionSaveSpy).toHaveBeenCalled();
                expect(session.user).toEqual(user);
            });
        });

        describe('logout', () => {
            it('should destroy the session', async () => {
                const mockNextApiRequest = createMockNextApiRequest('logout');
                const mockNextApiResponse = createMockNextApiResponse();

                const session = createMockSession();
                vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);
                const sessionDestroySpy = vi.spyOn(session, 'destroy');

                const handler = handleAuth(options);
                await handler(mockNextApiRequest, mockNextApiResponse);

                expect(sessionDestroySpy).toHaveBeenCalled();
                expect(mockNextApiResponse.redirect).toHaveBeenCalled();
            });
        });
    });
});
