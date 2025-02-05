import { describe, expect, it, vi } from 'vitest';
import { getSession } from '@/lib/app/session';
import { createMockSession } from '../../vitest.setup';
import * as IronSession from 'iron-session';

describe('Session', () => {
    describe('getSession', () => {
        it('should return the session', async () => {
            const session = createMockSession();
            const getIronSessionSpy = vi.spyOn(IronSession, 'getIronSession').mockResolvedValue(session);

            expect(await getSession()).toBe(session);
            expect(getIronSessionSpy).toHaveBeenCalled();
        });
    });
});
