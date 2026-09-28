import type { EmitCtx } from '../../types/generate';
import { DEPENDENCY_VERSIONS } from '../dependency-versions';
import { setFile } from '../files';

export function emitBiome(ctx: EmitCtx): void {
  ctx.pkg.scripts.lint = 'biome lint .';
  ctx.pkg.devDependencies['@biomejs/biome'] =
    DEPENDENCY_VERSIONS['@biomejs/biome'];

  const nestDecorators = ctx.stack.backend === 'nest';

  setFile(
    ctx.files,
    'biome.json',
    JSON.stringify(
      {
        $schema: 'https://biomejs.dev/schemas/2.2.4/schema.json',
        linter: { enabled: true },
        formatter: { enabled: false },
        javascript: {
          parser: nestDecorators
            ? { unsafeParameterDecoratorsEnabled: true }
            : {},
        },
      },
      null,
      2
    )
  );
}
