import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  {
    ignores: ['build/', 'dist/', 'node_modules/']
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },

      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },

    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },

    settings: {
      react: {
        version: 'detect'
      }
    },

    rules: {
      'react/prop-types': 'off',
      'react/display-name': 'warn',
      'react/jsx-key': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/no-array-index-key': 'warn',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps':
        process.env.NODE_ENV === 'production' ? 'error' : 'warn',

      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],

      'no-console':
        process.env.NODE_ENV === 'production'
          ? ['error', { allow: ['warn', 'error'] }]
          : 'off',

      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

      'no-var': 'error',
      'prefer-const': 'warn',
      eqeqeq: ['error', 'always', { null: 'ignore' }]
    }
  }
];
