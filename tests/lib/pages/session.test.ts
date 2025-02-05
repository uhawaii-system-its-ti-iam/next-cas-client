import { describe, expect, it, vi } from 'vitest';
import { getSession } from '@/lib/pages/session';
import { createMockNextApiRequest, createMockNextApiResponse, createMockSession } from '../../vitest.setup';
import * as IronSession from 'iron-session';
import { GetServerSidePropsContext } from 'next';

describe('Session', () => {
    describe('getSession', () => {
        it('should return the session using context', async () => {
            const context = {
                req: createMockNextApiRequest('login'),
                res: createMockNextApiResponse()
            } as unknown as GetServerSidePropsContext;

            const session = createMockSession();
            const getIronSessionSpy = vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);

            expect(await getSession(context)).toBe(session);
            expect(getIronSessionSpy).toHaveBeenCalled();
        });

        it('should return the session using req and res', async () => {
            const req = createMockNextApiRequest('login');
            const res = createMockNextApiResponse();

            const session = createMockSession();
            const getIronSessionSpy = vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);

            expect(await getSession(req, res)).toBe(session);
            expect(getIronSessionSpy).toHaveBeenCalled();
        });
    });
});
