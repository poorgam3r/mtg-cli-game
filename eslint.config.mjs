import js from '@eslint/js';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['node_modules', 'dist', 'aws/dist/**'], // ✅ ignore build folders if needed
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, prettier: prettierPlugin },
    extends: ['js/recommended'],
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['index.js'], // ✅ Node.js script
    languageOptions: {
      sourceType: 'script',
      globals: globals.node,
    },
  },
  {
    files: ['aws/dist/**/*.js'], // ✅ Browser scripts
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
