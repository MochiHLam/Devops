import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Allow exporting both components and hooks from context files
      'react-refresh/only-export-components': 'warn',
      // Allow empty catch blocks in event handlers
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Allow unused vars starting with _ (error suppression pattern)
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      // Allow setState in effects for simple flag patterns
      'react-hooks/set-state-in-effect': 'off',
      // Downgrade immutability to warning
      'react-hooks/immutability': 'warn',
    },
  },
])
