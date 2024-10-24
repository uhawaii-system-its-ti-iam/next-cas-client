import { enableFetchMocks } from 'jest-fetch-mock';
import fs from 'fs';

enableFetchMocks();

Object.defineProperty(window, 'location', {
    value: {
        href: ''
    },
    writable: true
});

export const createMockSession = (user?: any) => ({
    user,
    destroy: jest.fn(),
    save: jest.fn(),
    updateConfig: jest.fn()
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const loadResourceJSON = (path: string): object => require(`./resources/${path}`);
export const loadResourceXML = (path: string): string =>
    fs.readFileSync(`./test/resources/${path}`, { encoding: 'utf-8' });
