import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

import boundaries from 'eslint-plugin-boundaries';

export default defineConfig([
  globalIgnores(['dist', 'dev-dist']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      boundaries,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.app.json',
        },
      },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/App.tsx' },
        { type: 'feature', pattern: 'src/features/*' },
        { type: 'page', pattern: 'src/components/pages/*' },
        { type: 'organism', pattern: 'src/components/organisms/*' },
        { type: 'molecule', pattern: 'src/components/molecules/*' },
        { type: 'atom', pattern: 'src/components/atoms/*' },
        { type: 'shared', pattern: 'src/(hooks|utils|context|interfaces|data)/*' },
      ],
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'app',
              allow: ['feature', 'page', 'organism', 'molecule', 'shared'],
            },
            {
              from: 'feature',
              allow: ['atom', 'molecule', 'organism', 'shared', 'feature'], // Self-import allowed by default? No, features shouldn't import other features usually, but sub-components might. Let's start strict.
            },
            {
              from: 'page',
              allow: ['feature', 'organism', 'molecule', 'atom', 'shared'],
            },
            {
              from: 'organism',
              allow: ['organism', 'molecule', 'atom', 'shared'],
            },
            {
              from: 'molecule',
              allow: ['atom', 'shared'],
            },
            {
              from: 'atom',
              allow: ['shared'],
            },
            {
              from: 'shared',
              allow: ['shared'],
            },
          ],
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
