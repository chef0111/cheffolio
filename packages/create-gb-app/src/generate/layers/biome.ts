import { setFile } from "#/generate/files";
import type { EmitCtx } from "#/generate/types";

export function emitBiome(ctx: EmitCtx): void {
  ctx.pkg.scripts.lint = "biome check .";
  ctx.pkg.scripts.format = "biome check --write .";
  ctx.pkg.devDependencies["@biomejs/biome"] = "^2.2.4";

  const nestDecorators = ctx.stack.backend === "nest";

  setFile(
    ctx.files,
    "biome.json",
    JSON.stringify(
      {
        $schema: "https://biomejs.dev/schemas/2.2.4/schema.json",
        linter: { enabled: true },
        formatter: { enabled: true },
        javascript: {
          parser: nestDecorators
            ? { unsafeParameterDecoratorsEnabled: true }
            : {},
        },
      },
      null,
      2,
    ),
  );
}
