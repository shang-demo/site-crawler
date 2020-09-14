module.exports = {
  extends: ['react-app', '@ofa2/eslint-config'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  globals: {},
  rules: {
    'class-methods-use-this': ['error', { exceptMethods: ['render'] }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
