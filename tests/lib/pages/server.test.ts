import { describe, expect, it, vi } from 'vitest';
import { getCurrentUser, isLoggedIn } from '@/lib/pages/server';
import * as IronSession from 'iron-session';
import { createMockNextApiRequest, createMockNextApiResponse, createMockSession } from '../../vitest.setup';
import { GetServerSidePropsContext } from 'next';

describe('Server', () => {
    type User = { name: string; uid: string };
    const user = { name: 'name', uid: 'uid' } as User;
    const context = {
        req: createMockNextApiRequest('login'),
        res: createMockNextApiResponse()
    } as unknown as GetServerSidePropsContext;

    describe('getCurrentUser', () => {
        it('should return the current user', async () => {
            vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession(user));

            expect(await getCurrentUser<User>(context)).toEqual(user);
        });

        it('should return null when no current user is stored in session', async () => {
            vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession());

            expect(await getCurrentUser<User>(context)).toBeNull();
        });
    });

    describe('isLoggedIn', () => {
        it('should return true', async () => {
            vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession(user));

            expect(await isLoggedIn(context)).toBeTruthy();
        });

        it('should return false', async () => {
            vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession());

            expect(await isLoggedIn(context)).toBeFalsy();
        });
    });
});
