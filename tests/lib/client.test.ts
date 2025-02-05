import { afterEach, describe, expect, it, vi } from 'vitest';
import { login, logout } from '@/lib/client';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const casUrl = process.env.NEXT_PUBLIC_CAS_URL as string;

describe('Client', () => {
    afterEach(() => {
        vi.resetModules();
    });

    describe('login', () => {
        const casLoginUrl = `${casUrl}/login?service=${encodeURIComponent(`${baseUrl}/api/cas/login`)}`;

        it('should visit the CAS login URL', () => {
            login();
            expect(window.location.href).toBe(casLoginUrl);

            login({ renew: false });
            expect(window.location.href).toBe(casLoginUrl);
        });

        it('should add &renew=true to URL', () => {
            login({ renew: true });
            expect(window.location.href).toBe(casLoginUrl + '&renew=true');
        });
    });

    describe('logout', () => {
        const casLogoutUrl = `${casUrl}/logout?service=${encodeURIComponent(`${baseUrl}/api/cas/logout`)}`;

        it('should visit the CAS logout URL', () => {
            logout({ enableSLO: true });
            expect(window.location.href).toBe(casLogoutUrl);
        });

        it('should not visit the CAS logout URL', () => {
            logout();
            expect(window.location.href).toBe(`${baseUrl}/api/cas/logout`);

            logout({ enableSLO: false });
            expect(window.location.href).toBe(`${baseUrl}/api/cas/logout`);
        });
    });
});
