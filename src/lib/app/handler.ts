import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { HandleAuthOptions, handleLogin, handleLogout } from '../handler';
import { getSession } from './session';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

/**
 * Handles the login and logout redirects from CAS.
 * Used in app/api/cas/[client] folder of Next.js project.
 *
 * @param options - The HandleAuthOptions
 */
export const handleAuth =
    (options: HandleAuthOptions) =>
    async (req: NextRequest, { params }: { params: { client: 'login' | 'logout' } }) => {
        try {
            const session = await getSession();
            if (params.client === 'login') {
                await handleLogin(req.nextUrl.searchParams.get('ticket') as string, session, options);
            }
            if (params.client === 'logout') {
                await handleLogout(session);
            }
        } catch (err) {
            console.error(err);
        } finally {
            const redirectUrl = req.nextUrl.searchParams.get('redirect');

            if (redirectUrl) {
                redirect(redirectUrl);
            } else {
                redirect(baseUrl);
            }
        }
    };
