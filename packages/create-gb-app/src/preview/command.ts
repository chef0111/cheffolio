import { parsePresetToken } from "../preset";
import { YES_DEFAULTS } from "../stack/resolve";
import type { RawFlags } from "../stack/types";
import type { FlagGroup } from "../stack/vocab";
import { RELATIONAL_GROUPS, STACK_CLI_FLAGS } from "../stack/vocab";

function shellQuote(value: string): string {
  if (/^[A-Za-z0-9._@/=+-]+$/.test(value)) {
    return value;
  }
  return `'${value.replaceAll("'", `'\\''`)}'`;
}

function impliedValue(baseline: RawFlags, key: FlagGroup): string | undefined {
  const backend = baseline.backend ?? YES_DEFAULTS.backend;
  if (
    backend === "convex" &&
    (RELATIONAL_GROUPS as readonly FlagGroup[]).includes(key)
  ) {
    return undefined;
  }
  const fromBaseline = baseline[key];
  if (fromBaseline !== undefined) {
    return fromBaseline;
  }
  return YES_DEFAULTS[key];
}

function definedEntries(flags: RawFlags): Array<[string, string]> {
  const baseline = flags.preset ? parsePresetToken(flags.preset) : {};
  const entries: Array<[string, string]> = [];
  for (const { key, flag } of STACK_CLI_FLAGS) {
    const current = flags[key];
    if (current === undefined || current === impliedValue(baseline, key)) {
      continue;
    }
    entries.push([flag, current]);
  }
  return entries;
}

export function formatCommand(flags: RawFlags): string {
  const dir = shellQuote(flags.projectName ?? "my-gb-app");
  const parts = ["create-gb-app", dir];
  if (flags.preset) {
    parts.push("--preset", shellQuote(flags.preset));
  }
  for (const [flag, value] of definedEntries(flags)) {
    parts.push(flag, shellQuote(value));
  }
  if (flags.noGit) {
    parts.push("--no-git");
  }
  if (flags.noInstall) {
    parts.push("--no-install");
  }
  return parts.join(" ");
}
