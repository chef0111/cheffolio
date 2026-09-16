#!/usr/bin/env bun

import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "../package.json" with { type: "json" };
import { ALL_TARGETS, platformPackageName } from "./targets.ts";

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "..");

export type WrapperManifest = {
  name: string;
  version: string;
  license: string;
  bin: Record<string, string>;
  scripts: { postinstall: string };
  os: string[];
  cpu: string[];
  optionalDependencies: Record<string, string>;
};

export function wrapperPackageJson(
  binaries: Record<string, string>,
  version = pkg.version,
): WrapperManifest {
  return {
    name: pkg.name,
    version,
    license: pkg.license,
    bin: {
      "create-gb-app": "./bin/create-gb-app.mjs",
    },
    scripts: {
      postinstall: "node ./postinstall.mjs",
    },
    os: ["darwin", "linux", "win32"],
    cpu: ["arm64", "x64"],
    optionalDependencies: binaries,
  };
}

export function defaultBinaryVersions(version = pkg.version): Record<string, string> {
  const binaries: Record<string, string> = {};
  for (const target of ALL_TARGETS) {
    binaries[platformPackageName(target, pkg.name)] = version;
  }
  return binaries;
}

export async function writeWrapper(dest = join(root, "dist", pkg.name)): Promise<WrapperManifest> {
  const binaries = defaultBinaryVersions();
  const manifest = wrapperPackageJson(binaries);
  await mkdir(join(dest, "bin"), { recursive: true });
  await Bun.write(join(dest, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  await Bun.write(join(dest, "postinstall.mjs"), Bun.file(join(root, "script/postinstall.mjs")));
  await Bun.write(join(dest, "bin/create-gb-app.mjs"), Bun.file(join(root, "script/run.mjs")));
  return manifest;
}

if (import.meta.main) {
  const manifest = await writeWrapper();
  console.log(`wrote wrapper ${manifest.name}@${manifest.version}`);
  if (process.argv.includes("--publish")) {
    throw new Error("npm publish is waiting for an explicit operator command");
  }
}
