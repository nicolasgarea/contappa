module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    settings: {
        react: {
            version: 'detect'
        }
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                semi: false,
                singleQuote: true,
                tabWidth: 2,
                printWidth: 100,
                trailingComma: 'all',
                bracketSpacing: true,
                singleAttributePerLine: true
            }
        ],
        'react/react-in-jsx-scope': 'off'
    }
}
