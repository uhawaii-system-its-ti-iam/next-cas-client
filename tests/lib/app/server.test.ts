import { describe, expect, it, vi } from 'vitest';
import { getCurrentUser, isLoggedIn } from '@/lib/app/server';
import * as IronSession from 'iron-session';
import { createMockSession } from '../../vitest.setup';

describe('Server', () => {
    type User = { name: string; uid: string };
    const user = { name: 'name', uid: 'uid' } as User;

    describe('getCurrentUser', () => {
        it('should return the current user', async () => {
            vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession(user));

            expect(await getCurrentUser<User>()).toEqual(user);
        });

        it('should return null when no current user is stored in session', async () => {
            vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession());

            expect(await getCurrentUser<User>()).toBeNull();
        });
    });

    describe('isLoggedIn', () => {
        it('should return true', async () => {
            vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession(user));

            expect(await isLoggedIn()).toBeTruthy();
        });

        it('should return false', async () => {
            vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession());

            expect(await isLoggedIn()).toBeFalsy();
        });
    });
});
