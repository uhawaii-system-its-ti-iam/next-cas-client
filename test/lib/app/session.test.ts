import { getSession } from '@/lib/app/session';
import { createMockSession } from '../../setup-jest';
import * as IronSession from 'iron-session';

describe('Session', () => {
    describe('getSession', () => {
        it('should return the session', async () => {
            const session = createMockSession();
            const getIronSessionSpy = jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);

            expect(await getSession()).toBe(session);
            expect(getIronSessionSpy).toHaveBeenCalled();
        });
    });
});
