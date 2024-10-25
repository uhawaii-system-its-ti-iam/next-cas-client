import { handleAuth, ValidatorProtocol } from 'next-cas-client';

export const GET = handleAuth({ validator: ValidatorProtocol.CAS30 });
