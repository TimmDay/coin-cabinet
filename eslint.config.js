import tseslint from "typescript-eslint"

export default [
  {
    ignores: [
      ".next",
      "src/test-setup.ts",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      // Enforce nullish coalescing over logical OR when appropriate
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "error",
      // Prevent any types (relaxed for external data handling)
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      // Type inference improvements
      "@typescript-eslint/no-inferrable-types": "error",
      // Prefer function declarations over arrow functions for top-level functions
      "prefer-arrow-callback": "off",
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      // No semicolons at end of statements
      semi: ["error", "never"],
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
]
