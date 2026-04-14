const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const casUrl = process.env.NEXT_PUBLIC_CAS_URL as string;

export interface LoginOptions {
    renew?: boolean;
    redirectUrl?: string;
}

/**
 * Redirects to the CAS login.
 */
export const login = (options?: LoginOptions): void => {
    let loginUrl = `${casUrl}/login?service=${encodeURIComponent(`${baseUrl}/api/cas/login${options?.redirectUrl ? `?redirect=${encodeURIComponent(options.redirectUrl)}` : ''}`)}`;
    if (options?.renew) {
        loginUrl += '&renew=true';
    }

    window.location.href = loginUrl;
};

export interface LogoutOptions {
    enableSLO?: boolean;
}

/**
 * Redirects to the CAS logout.
 */
export const logout = (options?: LogoutOptions): void => {
    if (!options?.enableSLO) {
        window.location.href = `${baseUrl}/api/cas/logout`;
        return;
    }
    window.location.href = `${casUrl}/logout?service=${encodeURIComponent(`${baseUrl}/api/cas/logout`)}`;
};
