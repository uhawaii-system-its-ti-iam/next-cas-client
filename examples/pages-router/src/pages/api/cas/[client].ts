import { ValidatorProtocol } from 'next-cas-client';
import { handleAuth } from 'next-cas-client/pages';

export default handleAuth({ validator: ValidatorProtocol.CAS30 });
