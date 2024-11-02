import { IronSession, getIronSession } from 'iron-session';
import { SessionData, SessionOptions } from '../session';
import { cookies } from 'next/headers';

export const getSession = async (): Promise<IronSession<SessionData>> => {
    return await getIronSession<SessionData>(cookies(), SessionOptions);
};
