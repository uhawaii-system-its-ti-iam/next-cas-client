import { CasUser } from '../types';
import { getSession } from './session';
import { GetServerSidePropsContext } from 'next';

/**
 * Gets the current logged-in user.
 *
 * @returns The current user T
 */
export const getCurrentUser = async <T = CasUser>(context: GetServerSidePropsContext): Promise<T | null> => {
    const { user } = await getSession(context);
    return user ?? null;
};

/**
 * Returns true if a user is logged-in.
 *
 * @returns True if logged in
 */
export const isLoggedIn = async (context: GetServerSidePropsContext): Promise<boolean> => {
    const { user } = await getSession(context);
    return user !== null && user !== undefined;
};
