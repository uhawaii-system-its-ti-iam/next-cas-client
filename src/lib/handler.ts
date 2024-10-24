import { NextRequest } from 'next/server';
import { getSession } from './session';
import { redirect } from 'next/navigation';
import { CasUser } from './types';
import { ValidatorFactory, ValidatorProtocol } from './validators/validator';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

interface HandleAuthOptions {
    validator: ValidatorProtocol;
    loadUser?: (casUser: CasUser) => any | Promise<any>;
}

const handleLogin = async (ticket: string, options: HandleAuthOptions): Promise<void> => {
    const validator = ValidatorFactory.getValidator(options.validator);
    const casUser = await validator.validate(ticket);

    const session = await getSession();
    session.user = options.loadUser ? await options.loadUser(casUser) : casUser;
    await session.save();
};

const handleLogout = async (): Promise<void> => {
    const session = await getSession();
    session.destroy();
};

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
            if (params.client === 'login') {
                await handleLogin(req.nextUrl.searchParams.get('ticket') as string, options);
            }
            if (params.client === 'logout') {
                await handleLogout();
            }
        } catch (err) {
            console.error(err);
        } finally {
            redirect(baseUrl);
        }
    };
