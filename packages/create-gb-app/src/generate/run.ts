import { basename, resolve } from "node:path";
import type { RawFlags } from "../stack/types.ts";
import type { Stack } from "../stack/types.ts";
import { inferPackageManager } from "../cli/package-manager.ts";
import { buildTree } from "./build-tree.ts";
import type { PackageManager } from "./types.ts";
import { writeTree } from "./write-tree.ts";

async function runCommand(command: string[], cwd: string): Promise<void> {
  const proc = Bun.spawn(command, {
    cwd,
    stdout: "inherit",
    stderr: "inherit",
  });
  const code = await proc.exited;
  if (code !== 0) {
    throw new Error(`${command.join(" ")} exited ${code}`);
  }
}

export async function generateApp(options: {
  dest: string;
  stack: Stack;
  flags: RawFlags;
  packageManager?: PackageManager;
}): Promise<{ dest: string; fileCount: number }> {
  const dest = resolve(options.dest);
  const packageManager =
    options.packageManager ?? inferPackageManager();
  const files = buildTree(options.stack, {
    projectName: basename(dest) || "app",
    packageManager,
  });
  await writeTree(dest, files);

  if (!options.flags.noGit) {
    await runCommand(["git", "init"], dest);
  }
  if (!options.flags.noInstall) {
    await runCommand([packageManager, "install"], dest);
  }

  return { dest, fileCount: Object.keys(files).length };
}
