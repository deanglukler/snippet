module.exports = {
  extends: ['erb', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '_', argsIgnorePattern: '^_' },
    ],
    'no-use-before-define': 'off',
    'func-names': 'off',
    'max-classes-per-file': 'off',
    'prefer-destructuring': 'off',
    'lines-between-class-members': 'off',
    'react/jsx-no-bind': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/order': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
