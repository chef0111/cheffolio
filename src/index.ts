#!/usr/bin/env bun

import { parseArgs, ParseError, USAGE } from "./cli/parse-args.ts";
import { VERSION } from "./cli/version.ts";
import { inferPackageManager } from "./cli/package-manager.ts";
import { generateApp } from "./generate/run.ts";
import { CompatError } from "./stack/errors.ts";
import { resolveStack } from "./stack/resolve.ts";
import type { RawFlags } from "./stack/types.ts";

function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

function shouldGenerateHeadless(flags: RawFlags): boolean {
  return Boolean(flags.yes) || !isInteractive();
}

export async function main(argv: string[]): Promise<void> {
  let flags: RawFlags;
  try {
    flags = parseArgs(argv);
  } catch (error) {
    if (error instanceof ParseError) {
      process.stderr.write(`error: ${error.message}\n`);
      process.exitCode = 1;
      return;
    }
    throw error;
  }

  if (flags.help) {
    process.stdout.write(USAGE);
    return;
  }

  if (flags.version) {
    process.stdout.write(`${VERSION}\n`);
    return;
  }

  if (!shouldGenerateHeadless(flags)) {
    const { mountWizard } = await import("./tui/mount.ts");
    await mountWizard(flags);
    return;
  }

  if (!flags.projectName) {
    process.stderr.write("error: missing directory\n");
    process.exitCode = 1;
    return;
  }

  try {
    const stack = resolveStack(flags);
    const result = await generateApp({
      dest: flags.projectName,
      stack,
      flags,
      packageManager: inferPackageManager(),
    });
    process.stdout.write(`done: wrote ${result.fileCount} files to ${result.dest}\n`);
  } catch (error) {
    if (error instanceof CompatError) {
      process.stderr.write(`error: ${error.message}\n`);
      process.exitCode = 1;
      return;
    }
    if (error instanceof Error) {
      process.stderr.write(`error: ${error.message}\n`);
      process.exitCode = 1;
      return;
    }
    throw error;
  }
}

await main(process.argv.slice(2));
