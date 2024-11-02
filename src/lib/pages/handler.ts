import { NextApiRequest, NextApiResponse } from 'next';
import { HandleAuthOptions, handleLogin, handleLogout } from '../handler';
import { getSession } from './session';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

export const handleAuth = (options: HandleAuthOptions) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await getSession(req, res);

        if (req.query.client === 'login') {
            await handleLogin(req.query.ticket as string, session, options);
        }
        if (req.query.client === 'logout') {
            await handleLogout(session);
        }
    } catch (err) {
        console.error(err);
    } finally {
        res.redirect(baseUrl);
    }
};
