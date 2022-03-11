module.exports = {
    'extends': 'stylelint-config-standard-scss',
    'plugins': [
        'stylelint-scss'
    ],
    customSyntax: 'postcss-scss',
    'rules': {
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'scss/dollar-variable-pattern': '^foo',
        'scss/selector-no-redundant-nesting-selector': true,
    }
}