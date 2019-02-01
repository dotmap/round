module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    tsconfigRootDir: './'
  },
  plugins: ['@typescript-eslint', 'react'],
  extends: ['plugin:@typescript-eslint/recommended', 'standard'],
  rules: {
    'react/jsx-uses-vars': 'error',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'no-unused-vars': 0,
    indent: 0,
    '@typescript-eslint/indent': 0,
    curly: 0,
    '@typescript-eslint/member-delimiter-style': [
      2,
      {
        multiline: {
          delimiter: 'none'
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ]
  }
}
