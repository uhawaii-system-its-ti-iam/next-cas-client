import type { Config } from 'jest';

const config: Config = {
    coverageReporters: ['json-summary', 'text', 'html'],
    collectCoverageFrom: ['./src/**/*.ts*'],
    rootDir: './',
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/test/setup-jest.ts'],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: []
    },
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest'
    }
};

export default config;
