import { inferPackageManager } from "../cli/package-manager.ts";
import { generateApp } from "../generate/run.ts";
import { resolveStack } from "../stack/resolve.ts";
import type { RawFlags } from "../stack/types.ts";

export async function runWizardGenerate(flags: RawFlags): Promise<void> {
  const dest = flags.projectName ?? "my-app";
  try {
    const stack = resolveStack(flags);
    const result = await generateApp({
      dest,
      stack,
      flags: { ...flags, projectName: dest },
      packageManager: inferPackageManager(),
    });
    process.stdout.write(
      `done: wrote ${result.fileCount} files to ${result.dest}\n`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`error: ${message}\n`);
    process.exitCode = 1;
  }
}
