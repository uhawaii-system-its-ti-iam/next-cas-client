import { getCurrentUser, isLoggedIn } from '@/lib/server';
import * as IronSession from 'iron-session';
import { createMockSession } from '../setup-jest';

describe('Server', () => {
    type User = { name: string; uid: string };
    const user = { name: 'name', uid: 'uid' } as User;

    describe('getCurrentUser', () => {
        it('should return the current user', async () => {
            jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession(user));

            expect(await getCurrentUser<User>()).toEqual(user);
        });
    });

    describe('isLoggedIn', () => {
        it('should return true', async () => {
            jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession(user));

            expect(await isLoggedIn()).toBeTruthy();
        });

        it('should return false', async () => {
            jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession());

            expect(await isLoggedIn()).toBeTruthy();
        });
    });
});
