import type { EmitCtx } from '../../types/generate';
import { setFile } from '../files';

export function emitEslintPrettier(ctx: EmitCtx): void {
  ctx.pkg.scripts.lint = 'eslint .';
  ctx.pkg.scripts.format = 'prettier --write .';
  ctx.pkg.devDependencies.eslint = '^9.35.0';
  ctx.pkg.devDependencies['eslint-config-next'] = '^15.5.4';
  ctx.pkg.devDependencies['@eslint/eslintrc'] = '^3.3.1';
  ctx.pkg.devDependencies.prettier = '^3.6.2';
  ctx.pkg.devDependencies['eslint-config-prettier'] = '^10.1.8';

  setFile(
    ctx.files,
    'eslint.config.mjs',
    `import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: [".next/**", "node_modules/**"],
  },
];

export default eslintConfig;
`
  );

  setFile(
    ctx.files,
    'prettier.config.mjs',
    `const config = {
  semi: true,
  singleQuote: false,
};

export default config;
`
  );
}
