import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['build/**', '**/dist/**', '**/.astro/**']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      js,
      '@stylistic': stylistic
    },
    extends: ['js/recommended'],
    rules: {
      '@stylistic/quotes': ['error', 'single', { 'avoidEscape': true }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/key-spacing': ['error', { 'beforeColon': false, 'afterColon': true, 'mode': 'strict' }],
      '@stylistic/block-spacing': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/semi': ['error', 'never'],

      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/comma-spacing': ['error', { 'before': false, 'after': true }],
      '@stylistic/comma-style': ['error', 'last'],

      '@stylistic/computed-property-spacing': ['error', 'never'],
      '@stylistic/curly-newline': ['error', { 'consistent': true }],
      '@stylistic/eol-last': ['error', 'always'],

      '@stylistic/indent': ['error', 2],
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],
      '@stylistic/jsx-closing-tag-location': 'error',
      '@stylistic/jsx-curly-spacing': ['error', { 'when': 'never', 'children': true }],
      '@stylistic/jsx-equals-spacing': ['error', 'never'],
      '@stylistic/jsx-tag-spacing': ['error', { 'beforeSelfClosing': 'always' }],
      '@stylistic/jsx-self-closing-comp': 'error',

      '@stylistic/keyword-spacing': ['error', { 'before': true, 'after': true }],
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-before-function-paren': ['error', 'never'],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/space-infix-ops': 'error',

      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/switch-colon-spacing': 'error',

      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }]
    }
  }
])
