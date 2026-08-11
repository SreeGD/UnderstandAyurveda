import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * The storage restriction below is not a style preference — it is how
 * constitution Principle V (Privacy by Default, NON-NEGOTIABLE) stops being a
 * promise and becomes a reviewable property. All persistence flows through
 * src/storage/, so auditing the privacy guarantee means auditing one directory.
 * See contracts/storage-schema.md invariant T1.
 */
const storageRestriction = {
  files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
  ignores: [
    'src/storage/**',
    // These two must write raw values to verify the storage layer itself —
    // corrupt-payload handling cannot be tested through the very abstraction
    // being tested. tests/unit/no-network.test.ts additionally asserts
    // statically that nothing under src/ outside src/storage/ touches storage,
    // which is the check that actually protects the shipped app.
    'tests/unit/storage.test.ts',
    'tests/setup.ts',
  ],
  rules: {
    'no-restricted-globals': [
      'error',
      {
        name: 'localStorage',
        message: 'Use src/storage/store.ts — localStorage access is confined there (Principle V).',
      },
      {
        name: 'sessionStorage',
        message: 'Use src/storage/store.ts — session storage is not used by this app.',
      },
    ],
    'no-restricted-properties': [
      'error',
      {
        object: 'window',
        property: 'localStorage',
        message: 'Use src/storage/store.ts — localStorage access is confined there (Principle V).',
      },
      {
        object: 'window',
        property: 'sessionStorage',
        message: 'Use src/storage/store.ts — session storage is not used by this app.',
      },
    ],
  },
}

/**
 * No network APIs anywhere. The app has no backend and must never transmit user
 * data (Principle V, SC-010). A runtime test also asserts this, but failing at
 * lint time is cheaper than discovering it in review.
 */
const networkRestriction = {
  files: ['src/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-globals': [
      'error',
      { name: 'fetch', message: 'This app makes no network requests (Principle V).' },
      { name: 'XMLHttpRequest', message: 'This app makes no network requests (Principle V).' },
    ],
  },
}

export default tseslint.config(
  // `dist-review` is a local single-file bundle used for sharing a review
  // build. It is gitignored, so CI never sees it — but without it here, a
  // local `npm run lint` drowns in errors from minified output.
  { ignores: ['dist', 'dist-review', 'dev-dist', 'node_modules', 'coverage'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
  storageRestriction,
  networkRestriction,
  {
    // Tests legitimately stub network globals in order to assert they are never called.
    files: ['tests/**/*.{ts,tsx}', 'scripts/**/*.ts'],
    rules: { 'no-restricted-globals': 'off', '@typescript-eslint/no-explicit-any': 'off' },
  }
)
