module.exports = {
    env: {
        'amd': true,
        'browser': true,
        'es6': true,
        'jest': true,
        'mocha': true,
        'node': true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended'
    ],
    plugins: [
        'react',
        'jsx-a11y',
        'react-hooks',
    ],
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaFeatures: {
            'jsx': true
        },
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    rules: {
        'no-empty': 0,
        'no-dupe-args': 2,
        'no-dupe-keys': 2,
        'no-duplicate-case': 2,
        'eqeqeq': [2, 'smart'],
        quotes: [
            'error',
            'single'
        ],
        semi: [
            'error',
            'never'
        ],
        'no-nested-ternary': 2,
        'jsx-a11y/href-no-hash': 0,
        'jsx-a11y/img-has-alt': 0,
        'jsx-a11y/img-redundant-alt': [2, { components: ['Image'], words: ['.*[pP]hone', 'picture', '.*photo', '.*image', 'picture of', 'image of'] }],
        'jsx-a11y/onclick-has-focus': 0,
        'jsx-a11y/onclick-has-role': 0,
        'jsx-a11y/label-has-for': 0,
        'jsx-a11y/anchor-is-valid': 0,
        'indent': 1,
        'jsx-a11y/no-noninteractive-element-interactions': 1,
        'react/no-typos': 2,
        'max-len': [2, {
            code: 180,
            tabWidth: 4,
            ignoreTemplateLiterals: true,
            ignoreUrls: true,
            ignoreComments: true, // cannot have variable declarations split up onto multiple lines, p tags also cannot be split
            ignorePattern: '.*<p .*</p>|[\\s\\w\\d]*|[\\s\\w\\d]*|\\w*: \\w*|const [\\W\\s\\w\\d]* = [\\S\\W\\s\\w\\d\\(\\)]*|const [\\W\\s\\w\\d]* = [\\w\\W\\d\\D\\s\\S]*\\([\\S\\W\\s\\w\\d]*\\)'
        }]
    },
    overrides: [
        {
            files: ['*test.js'],
            rules: {
                'no-import-assign': 'off',
                'max-len': 'off'
            }
        },
        {
            files: ['*.js', '*.jsx'],
            extends: [
                'plugin:jsx-a11y/recommended',
            ],
            rules: {
                'react/jsx-equals-spacing': [2, 'never'],
                'react/boolean-prop-naming': 2,
                'react/no-multi-comp': [2, { ignoreStateless: true }],
                'react/prefer-es6-class': [2, 'always'],
                'react/prop-types': [2, { ignore: ['children'] }],
                'react/sort-prop-types': [2, { ignoreCase: true }],
                'react/react-in-jsx-scope': 2,
                'react/jsx-closing-bracket-location': [1, 'line-aligned'],
                'react/jsx-indent-props': 0,
                'react/jsx-tag-spacing': 2,
                'react/jsx-no-duplicate-props': [2, { ignoreCase: false }],
                'react/jsx-max-props-per-line': [2, { maximum: 6, when: 'always' }],
                'arrow-parens': [
                    0,
                    'as-needed'
                ],
                'camelcase': ['error', { allow: ['UNSAFE_componentWillMount', 'UNSAFE_componentWillReceiveProps', 'UNSAFE_componentWillUpdate'] }],
                'comma-dangle': 0,
                'generator-star-spacing': [
                    'error',
                    'after'
                ],
                'jsx-a11y/anchor-is-valid': [
                    'error',
                    {
                        'aspects': [
                            'noHref',
                        ]
                    }
                ],
                'jsx-a11y/no-onchange': 1,
                'jsx-quotes': [
                    2,
                    'prefer-double'
                ],
                'no-unused-expressions': 0,
                'lines-between-class-members': 2,
                'no-cond-assign': 0,
                'no-console': 1,
                'no-use-before-define': [
                    'error',
                    {
                        'functions': false,
                        'variables': false
                    }
                ],
                'no-var': 'error',
                'object-curly-spacing': [
                    'error',
                    'always'
                ],
                'operator-linebreak': 0,
                'prefer-const': [
                    'error',
                    {
                        'destructuring': 'any',
                        'ignoreReadBeforeAssign': true
                    }
                ],
                'quote-props': [
                    2,
                    'as-needed',
                    {
                        'unnecessary': false
                    }
                ],
                'react/jsx-curly-spacing': [
                    2,
                    {
                        'children': true,
                        'spacing': {
                            'objectLiterals': 'never'
                        },
                        'when': 'always'
                    }
                ],
                'react/jsx-no-undef': 2,
                'react/jsx-quotes': 0,
                'react/jsx-uses-react': 1,
                'react/jsx-uses-vars': 1,
                'react/jsx-wrap-multilines': 1,
                'react/no-deprecated': 1,
                'react/no-unknown-property': 2,
                'react/sort-comp': [
                    2,
                    {
                        'groups': {
                            'lifecycle': [
                                'displayName',
                                'propTypes',
                                'contextTypes',
                                'childContextTypes',
                                'state',
                                'statics',
                                'constructor',
                                'defaultProps',
                                'getDefaultProps',
                                'getInitialState',
                                'getChildContext',
                                'getDerivedStateFromProps',
                                'componentWillMount',
                                'UNSAFE_componentWillMount',
                                'componentDidMount',
                                'componentWillReceiveProps',
                                'UNSAFE_componentWillReceiveProps',
                                'shouldComponentUpdate',
                                'componentWillUpdate',
                                'UNSAFE_componentWillUpdate',
                                'getSnapshotBeforeUpdate',
                                'componentDidUpdate',
                                'componentWillUnmount',
                                'componentDidCatch',
                                'mixins'
                            ]
                        },
                        'order': [
                            'static-methods',
                            'lifecycle',
                            'render',
                            'everything-else'
                        ]
                    }
                ],
                'sort-imports': ['error', {
                    'ignoreCase': false,
                    'ignoreDeclarationSort': true,
                    'ignoreMemberSort': false,
                    'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single']
                }],
                'yield-star-spacing': [
                    'error',
                    'after'
                ]
            }
        }
    ],
    settings: {
        react: {
            version: 'detect'
        }
    }
}
