#!/usr/bin/env bun

import { parseArgs, ParseError, USAGE } from "./cli/parse-args.ts";
import { CompatError } from "./stack/errors.ts";
import { resolveStack } from "./stack/resolve.ts";

function main(argv: string[]): void {
  let flags;
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

  try {
    const stack = resolveStack(flags);
    process.stdout.write(`${JSON.stringify(stack, null, 2)}\n`);
  } catch (error) {
    if (error instanceof CompatError) {
      process.stderr.write(`error: ${error.message}\n`);
      process.exitCode = 1;
      return;
    }
    throw error;
  }
}

main(process.argv.slice(2));
