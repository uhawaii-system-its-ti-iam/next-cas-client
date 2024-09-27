import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionData {
    user: any;
}

const SessionOptions = {
    cookieName: 'SESSIONID',
    password: process.env.NEXT_CAS_CLIENT_SECRET as string,
    ttl: 86400, // 1 day in seconds
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production'
    }
};

export const getSession = async (): Promise<IronSession<SessionData>> => {
    return await getIronSession<SessionData>(cookies(), SessionOptions);
};
