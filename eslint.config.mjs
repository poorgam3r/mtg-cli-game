import js from '@eslint/js';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['node_modules', 'dist/**', 'aws/dist/**'], // Ensure the dist directory is ignored
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], // Include all relevant file types
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
  },
  {
    files: ['**/__tests__/**/*.{js,ts}'], // Apply this configuration to test files
    languageOptions: {
      globals: {
        jest: true, // Enable Jest globals
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
      },
    },
  },
];
