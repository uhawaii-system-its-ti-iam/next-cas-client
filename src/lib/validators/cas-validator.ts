import { CasUser } from '../types';

export interface CasValidationResponse {
    serviceResponse:
        | {
              authenticationFailure: {
                  code: string;
                  description: string;
              };
          }
        | {
              authenticationSuccess: {
                  user: string;
                  proxyGrantingTicket?: string;
                  proxies?: string[];
                  attributes: Record<string, string | string[]>;
              };
          };
}

export const validate = async (validationUrl: string, ticket: string): Promise<CasUser> => {
    try {
        const response = await fetch(`${validationUrl}&ticket=${encodeURIComponent(ticket)}&format=json`);
        const data = (await response.json()) as CasValidationResponse;

        if ('authenticationFailure' in data.serviceResponse) {
            throw new Error('Ticket failed validation');
        }

        const { user, attributes } = data.serviceResponse.authenticationSuccess;
        return {
            user,
            attributes
        };
    } catch {
        throw new Error('Ticket failed validation');
    }
};
