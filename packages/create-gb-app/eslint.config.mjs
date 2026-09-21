import tsParser from "@typescript-eslint/parser";

const tsSpecifier = {
  selector:
    ":matches(ImportDeclaration, ExportNamedDeclaration, ExportAllDeclaration, ImportExpression)[source.value=/\\.(ts|tsx)$/]",
  message: "Import without a .ts specifier.",
};

export default [
  {
    files: [
      "src/generate/**/*.{ts,tsx}",
      "src/preset.ts",
      "src/stack/**/*.{ts,tsx}",
      "test/**/*.{ts,tsx}",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-restricted-syntax": ["error", tsSpecifier],
    },
  },
];
