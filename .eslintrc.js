module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'google',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
  ],
  rules: {
    'max-len': 'off',
    'require-jsdoc': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
  },
};
