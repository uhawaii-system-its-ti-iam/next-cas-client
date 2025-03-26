import fs from 'fs';
import createFetchMock from 'vitest-fetch-mock';
import { vi } from 'vitest';
import { NextApiRequest, NextApiResponse } from 'next';

createFetchMock(vi).enableMocks();

vi.mock('iron-session');
vi.mock('next/headers');
vi.mock('next/navigation');

Object.defineProperty(window, 'location', {
    value: {
        href: ''
    },
    writable: true
});

export const createMockSession = (user?: any) => ({
    user,
    destroy: vi.fn(),
    save: vi.fn(),
    updateConfig: vi.fn()
});

export const createMockNextApiRequest = (client: string) =>
    ({
        query: {
            client,
            ticket: 'ticket1'
        }
    }) as unknown as NextApiRequest;

export const createMockNextApiResponse = () =>
    ({
        redirect: vi.fn()
    }) as unknown as NextApiResponse;

export const loadResourceJSON = (path: string): object => require(`./resources/${path}`);
export const loadResourceXML = (path: string): string =>
    fs.readFileSync(`./tests/resources/${path}`, { encoding: 'utf-8' });
