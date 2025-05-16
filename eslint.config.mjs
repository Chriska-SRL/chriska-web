import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import next from 'next';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  next(),
  eslintConfigPrettier, // Desactiva reglas que chocan con Prettier
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
