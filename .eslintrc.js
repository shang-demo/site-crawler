module.exports = {
  extends: ['@ofa2/eslint-config'],
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  globals: {
    $: false,
    window: false,
    document: false,
    alert: false,
    btoa: false,
    fetch: false,
  },
  rules: {
    'no-console': ['off'],
    'no-alert': ['off'],
  },
  settings: {
    'import/core-modules': ['@deep/deep'],
  },
};
