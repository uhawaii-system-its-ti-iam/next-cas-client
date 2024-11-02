import { SessionData } from './session';
import { CasUser } from './types';
import { ValidatorFactory, ValidatorProtocol } from './validators/validator';
import { IronSession } from 'iron-session';

export interface HandleAuthOptions {
    validator: ValidatorProtocol;
    loadUser?: (casUser: CasUser) => any | Promise<any>;
}

export const handleLogin = async (
    ticket: string,
    session: IronSession<SessionData>,
    options: HandleAuthOptions
): Promise<void> => {
    const validator = ValidatorFactory.getValidator(options.validator);
    const casUser = await validator.validate(ticket);

    session.user = options.loadUser ? await options.loadUser(casUser) : casUser;
    await session.save();
};

export const handleLogout = async (session: IronSession<SessionData>): Promise<void> => {
    session.destroy();
};
