module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2020,
        'sourceType': 'module'
    },
    'plugins': [
        'react'
    ],
    'rules': {
        'indent': 1,
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'no-dupe-args': 1,
        'no-dupe-keys': 1,
        'space-before-function-paren': 1,
        'no-tabs': 1,
        'object-curly-spacing': [1, 'always'],
        'space-in-parens': 1,
        'no-trailing-spaces': 1,
        'no-whitespace-before-property': 1,
        'no-duplicate-case': 1,
        'eqeqeq': [2, 'smart'],
        'no-nested-ternary': 2,
        'no-multi-spaces': ['error', { 'ignoreEOLComments': true }],
        'react/jsx-equals-spacing': [1, 'never'],
        'react/jsx-curly-spacing': [2, { 'when': 'always', 'spacing': {
            'objectLiterals': 'never'
        } }],
        'react/boolean-prop-naming': 1,
        'react/prop-types': [1, { 'ignore': ['children'] }],
        'react/no-multi-comp': [1, { 'ignoreStateless': true }],
        'react/prefer-es6-class': [1, 'always'],
        'react/sort-prop-types': [1, { 'ignoreCase': true }],
        'react/react-in-jsx-scope': 1,
        'template-curly-spacing': [1, 'always'],
        'jsx-a11y/href-no-hash': 0,
        'jsx-a11y/img-has-alt': 0,
        'react/jsx-closing-bracket-location': [1, 'line-aligned'],
        'react/jsx-tag-spacing': 1,
        'react/jsx-no-duplicate-props': [1, { 'ignoreCase': false }],
        'react/no-typos': 2,
        'max-len': [1, { 'code': 180, 'tabWidth': 4, 'ignoreTemplateLiterals': true, 'ignoreUrls': true, 'ignoreComments': true }],
        'no-debugger': 1,
        'no-console': 1,
        'no-unused-vars': 1
    }
}
