import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['cjs', 'esm'],
    entry: ['./src/index.ts', './src/app.ts', './src/pages.ts'],
    target: 'node18',
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true
});
