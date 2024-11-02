import { handleAuth } from '@/lib/app/handler';
import { ValidatorProtocol } from '@/lib/validators/validator';
import { NextRequest } from 'next/server';
import { createMockSession, loadResourceXML } from '../../setup-jest';
import * as IronSession from 'iron-session';
import { CasUser } from '@/lib/types';
import { redirect } from 'next/navigation';

describe('Handler', () => {
    const baseUrl = 'https://example.com';
    const saml11ValidationSuccess = loadResourceXML('saml-11-validation-success.xml');
    const saml11ValidationFailure = loadResourceXML('saml-11-validation-failure.xml');

    describe('handleAuth', () => {
        const nextRequest = new NextRequest(new URL('/api/cas/login?ticket=ticket1', baseUrl));
        const options = { validator: ValidatorProtocol.SAML11 };

        describe('login', () => {
            beforeAll(() => {
                jest.useFakeTimers();
                jest.setSystemTime(new Date('2017-08-15T06:30:04.700Z'));
            });

            afterAll(() => {
                jest.useRealTimers();
            });

            it('should save the session and redirect', async () => {
                fetchMock.mockResponse(saml11ValidationSuccess);
                const session = createMockSession();
                const sessionSaveSpy = jest.spyOn(session, 'save');
                jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);

                const handler = handleAuth(options);
                await handler(nextRequest, { params: { client: 'login' } });

                expect(sessionSaveSpy).toHaveBeenCalled();
                expect(redirect).toHaveBeenCalled();
            });

            it('should redirect and not set the session when validation is invalid', async () => {
                const session = createMockSession();
                const sessionSaveSpy = jest.spyOn(session, 'save');
                jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);

                // Invalid ticket
                fetchMock.mockResponse(saml11ValidationFailure);

                const handler = handleAuth(options);
                await expect(handler(nextRequest, { params: { client: 'login' } })).resolves.not.toThrow();
                expect(sessionSaveSpy).not.toHaveBeenCalled();
                expect(redirect).toHaveBeenCalled();

                // Request error
                fetchMock.mockAbort();

                await expect(handler(nextRequest, { params: { client: 'login' } })).resolves.not.toThrow();
                expect(sessionSaveSpy).not.toHaveBeenCalled();
                expect(redirect).toHaveBeenCalled();
            });

            it('should call loadUser when defined', async () => {
                fetchMock.mockResponse(saml11ValidationSuccess);
                const session = createMockSession();
                const sessionSaveSpy = jest.spyOn(session, 'save');
                jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);

                const user = { uid: 'testPrincipal' };
                const loadUser = (casUser: CasUser) => ({ uid: casUser.user });

                const handler = handleAuth({ loadUser, ...options });
                await handler(nextRequest, { params: { client: 'login' } });

                expect(sessionSaveSpy).toHaveBeenCalled();
                expect(session.user).toEqual(user);
            });
        });

        describe('logout', () => {
            it('should destroy the session', async () => {
                const session = createMockSession();
                jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);
                const sessionDestroySpy = jest.spyOn(session, 'destroy');

                const handler = handleAuth(options);
                await handler(nextRequest, { params: { client: 'logout' } });

                expect(sessionDestroySpy).toHaveBeenCalled();
                expect(redirect).toHaveBeenCalled();
            });
        });
    });
});
