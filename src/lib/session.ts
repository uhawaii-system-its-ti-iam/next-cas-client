export interface SessionData {
    user: any;
}

export const SessionOptions = {
    cookieName: 'SESSIONID',
    password: process.env.NEXT_CAS_CLIENT_SECRET as string,
    ttl: 86400, // 1 day in seconds
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production'
    }
};
