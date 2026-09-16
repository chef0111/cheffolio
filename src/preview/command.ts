import { YES_DEFAULTS } from "../stack/resolve.ts";
import type { RawFlags } from "../stack/types.ts";

function definedEntries(flags: RawFlags): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  if (flags.frontend && flags.frontend !== YES_DEFAULTS.frontend) {
    entries.push(["--frontend", flags.frontend]);
  }
  if (flags.backend && flags.backend !== YES_DEFAULTS.backend) {
    entries.push(["--backend", flags.backend]);
  }
  if (flags.api && flags.backend !== "nest" && flags.api !== YES_DEFAULTS.api) {
    entries.push(["--api", flags.api]);
  }
  if (flags.database && flags.database !== YES_DEFAULTS.database) {
    entries.push(["--database", flags.database]);
  }
  if (flags.orm && flags.orm !== YES_DEFAULTS.orm) {
    entries.push(["--orm", flags.orm]);
  }
  if (flags.dbSetup && flags.dbSetup !== YES_DEFAULTS.dbSetup) {
    entries.push(["--db-setup", flags.dbSetup]);
  }
  if (flags.auth && flags.auth !== YES_DEFAULTS.auth) {
    entries.push(["--auth", flags.auth]);
  }
  if (flags.payments && flags.payments !== YES_DEFAULTS.payments) {
    entries.push(["--payments", flags.payments]);
  }
  if (flags.ui && flags.ui !== YES_DEFAULTS.ui) {
    entries.push(["--ui", flags.ui]);
  }
  if (flags.linter && flags.linter !== YES_DEFAULTS.linter) {
    entries.push(["--linter", flags.linter]);
  }
  return entries;
}

export function formatCommand(flags: RawFlags): string {
  const dir = flags.projectName ?? "my-app";
  const parts = ["create-gb-app", dir];
  for (const [flag, value] of definedEntries(flags)) {
    parts.push(flag, value);
  }
  if (flags.yes) {
    parts.push("--yes");
  }
  if (flags.noGit) {
    parts.push("--no-git");
  }
  if (flags.noInstall) {
    parts.push("--no-install");
  }
  return parts.join(" ");
}
