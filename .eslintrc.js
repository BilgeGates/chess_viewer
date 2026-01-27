/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es2022: true
  },

  extends: ['react-app', 'react-app/jest'],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
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
  },

  ignorePatterns: ['build/', 'dist/', 'node_modules/']
};
