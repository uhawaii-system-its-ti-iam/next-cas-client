import { CasUser } from '../types';
import { getSession } from './session';

/**
 * Gets the current logged-in user.
 *
 * @returns The current user T
 */
export const getCurrentUser = async <T = CasUser>(): Promise<T | null> => {
    const { user } = await getSession();
    return user ?? null;
};

/**
 * Returns true if a user is logged-in.
 *
 * @returns True if logged in
 */
export const isLoggedIn = async (): Promise<boolean> => {
    const { user } = await getSession();
    return user !== null && user !== undefined;
};
