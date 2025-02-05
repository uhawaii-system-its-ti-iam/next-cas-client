import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests/vitest.setup.ts',
        coverage: {
            provider: 'istanbul',
            enabled: true,
            include: ['**/src/**/*.ts*'],
            exclude: [...coverageConfigDefaults.exclude, '**/examples'],
            reporter: ['text', 'json-summary', 'html'],
            reportsDirectory: './coverage'
        }
    }
});
