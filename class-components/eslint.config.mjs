import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import parserTypeScript from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  {
    files: ['**/*.js', '**/*.jsx', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'writable',
        ReactDOM: 'writable',
        document: 'readonly',
        window: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
      },
    },
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
    },
    rules: {
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          printWidth: 80,
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
