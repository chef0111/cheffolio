import type { EmitCtx } from '../../types/generate';
import { setFile } from '../files';
import { isAppsLayout } from '../paths';

export function emitOxlint(ctx: EmitCtx): void {
  ctx.pkg.scripts.lint = 'oxlint .';
  ctx.pkg.scripts.format = 'oxfmt .';
  ctx.pkg.devDependencies.oxlint = '^1.16.0';
  ctx.pkg.devDependencies.oxfmt = '^0.5.0';

  const nextRoot =
    ctx.stack.frontend === 'next'
      ? { next: { rootDir: isAppsLayout(ctx.stack) ? 'apps/web' : '.' } }
      : {};

  setFile(
    ctx.files,
    '.oxlintrc.json',
    JSON.stringify(
      {
        $schema: './node_modules/oxlint/configuration_schema.json',
        plugins: ['typescript', 'react', 'unicorn'],
        ...(Object.keys(nextRoot).length > 0 ? { settings: nextRoot } : {}),
      },
      null,
      2
    )
  );
}
