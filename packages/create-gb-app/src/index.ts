#!/usr/bin/env bun

import {
  parseArgs,
  ParseError,
  shouldGenerateHeadless,
  USAGE,
} from "./cli/parse-args";
import { VERSION } from "./cli/version";
import { inferPackageManager } from "./cli/package-manager";
import { generateApp } from "./generate/run";
import { CompatError } from "./stack/errors";
import { resolveStack } from "./stack/resolve";
import type { RawFlags } from "./stack/types";

function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
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

  if (!shouldGenerateHeadless(flags, isInteractive())) {
    const { mountWizard } = await import("./tui/mount");
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
