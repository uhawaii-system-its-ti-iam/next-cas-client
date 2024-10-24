const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const casUrl = process.env.NEXT_PUBLIC_CAS_URL as string;

interface loginOptions {
    renew: boolean;
}

/**
 * Redirects the to the CAS login.
 */
export const login = (options?: loginOptions): void => {
    let loginUrl = `${casUrl}/login?service=${encodeURIComponent(`${baseUrl}/api/cas/login`)}`;
    if (options?.renew) {
        loginUrl += '&renew=true';
    }
    window.location.href = loginUrl;
};

interface logoutOptions {
    enableSLO: boolean;
}

/**
 * Redirects the to the CAS logout.
 */
export const logout = (options?: logoutOptions): void => {
    if (!options?.enableSLO) {
        window.location.href = `${baseUrl}/api/cas/logout`;
        return;
    }
    window.location.href = `${casUrl}/logout?service=${encodeURIComponent(`${baseUrl}/api/cas/logout`)}`;
};
