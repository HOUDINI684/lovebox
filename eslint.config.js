import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['src/**/*.{js,jsx}', 'shared/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022, sourceType: 'module', globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // JSX non analyse sans eslint-plugin-react : on evite les faux positifs.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]|^motion$', argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['api/**/*.js', 'tests/**/*.js', '*.config.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: { ...globals.node } },
    rules: js.configs.recommended.rules,
  },
]
