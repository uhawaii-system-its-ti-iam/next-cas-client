import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['cjs', 'esm'],
    entry: ['./src/index.ts', './src/app.ts', './src/pages.ts'],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true
});
