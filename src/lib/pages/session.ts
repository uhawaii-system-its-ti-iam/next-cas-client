import { IronSession, getIronSession } from 'iron-session';
import { SessionData, SessionOptions } from '../session';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

export async function getSession(req: NextApiRequest, res: NextApiResponse): Promise<IronSession<SessionData>>;
export async function getSession(context: GetServerSidePropsContext): Promise<IronSession<SessionData>>;
export async function getSession(
    reqOrContext: NextApiRequest | GetServerSidePropsContext,
    res?: NextApiResponse
): Promise<IronSession<SessionData>> {
    if (!res) {
        const context = reqOrContext as GetServerSidePropsContext;
        return await getIronSession<SessionData>(context.req, context.res, SessionOptions);
    }

    const req = reqOrContext as NextApiRequest;
    return await getIronSession<SessionData>(req, res, SessionOptions);
}
