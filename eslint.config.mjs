import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config({
    extends: [eslint.configs.recommended, eslintPluginPrettierRecommended, ...tseslint.configs.recommended],
    ignores: ['**/dist/*'],
    rules: {
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-require-imports': 'off'
    }
});
