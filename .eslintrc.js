module.exports = {
  env: {
    browser: true,
  },
  extends: ['airbnb'],
  parser: 'babel-eslint',
  plugins: ['babel'],
  rules: {
    'no-underscore-dangle': 'off',
    'no-new-func': 'off',
    'import/prefer-default-export': 'off',
    'import/named': 'off',
    'no-restricted-syntax': 'off',
    'consistent-return': 'off',
    'no-void': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off'
  },
};
