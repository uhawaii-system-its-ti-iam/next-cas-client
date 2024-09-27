/**
 * The CAS user and its attributes.
 */
export interface CasUser {
    user: string;
    attributes: Record<string, string | string[]>;
}
