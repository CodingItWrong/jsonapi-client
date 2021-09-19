module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  plugins: ['jest', 'prettier'],
  env: {
    es6: true,
    'jest/globals': true,
    node: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
