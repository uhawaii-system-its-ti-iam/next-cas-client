import { ValidatorProtocol } from 'next-cas-client';
import { handleAuth } from 'next-cas-client/app';

export const GET = handleAuth({ validator: ValidatorProtocol.CAS30 });
