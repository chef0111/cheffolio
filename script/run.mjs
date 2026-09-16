#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const binary = join(
  dir,
  process.platform === "win32" ? "create-gb-app.exe" : "create-gb-app",
);

if (!existsSync(binary)) {
  console.error("Error: create-gb-app's postinstall script was not run.");
  console.error("");
  console.error("This occurs when using --ignore-scripts during installation.");
  process.exit(1);
}

const result = spawnSync(binary, process.argv.slice(2), {
  stdio: "inherit",
  windowsHide: true,
});

process.exit(result.status === null ? 1 : result.status);
