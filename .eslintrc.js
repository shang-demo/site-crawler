module.exports = {
  extends: 'airbnb',
  installedESLint: true,
  plugins: [],
  globals: {
    _: false,
    config: false,
    Constants: false,
    CrawlerService: false,
    Errors: false,
    ExecuteCmdService: false,
    HookService: false,
    logger: false,
    MailSendService: false,
    mKoa: false,
    Mixed: false,
    Promise: false,
    Webhook: false,
    UtilService: false,
  },
  rules: {
    'arrow-body-style': ['error', 'always'],
    'brace-style': ['error', 'stroustrup'],
    'comma-dangle': ['error', {
      arrays: 'only-multiline',
      objects: 'only-multiline',
      imports: 'only-multiline',
      exports: 'only-multiline',
      functions: 'never',
    }],
    'no-param-reassign': ['error', {
      props: false,
    }],
    'no-underscore-dangle': ['error', {
      allow: ['_id', '__logs__', '_scan', '_updateById'],
    }],
    'no-use-before-define': ['error', {
      functions: false,
    }],
    'prefer-const': ['off'],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'ignore',
    }],
  },
};