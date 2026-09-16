import { expect, test } from "bun:test";
import { npmCli, packageNamesFor } from "../script/postinstall.mjs";
import { defaultBinaryVersions, wrapperPackageJson } from "../script/publish.ts";
import { binaryFileName } from "../script/targets.ts";

test("postinstall resolves win32-x64, darwin-arm64, and linux-x64 names", () => {
  expect(
    packageNamesFor({ platform: "win32", arch: "x64", avx2: true, musl: false })[0],
  ).toBe("create-gb-app-windows-x64");
  expect(
    packageNamesFor({ platform: "darwin", arch: "arm64", avx2: true, musl: false })[0],
  ).toBe("create-gb-app-darwin-arm64");
  expect(
    packageNamesFor({ platform: "linux", arch: "x64", avx2: true, musl: false })[0],
  ).toBe("create-gb-app-linux-x64");
});

test("win32 without avx2 prefers the baseline package", () => {
  expect(
    packageNamesFor({ platform: "win32", arch: "x64", avx2: false, musl: false })[0],
  ).toBe("create-gb-app-windows-x64-baseline");
});

test("windows compile output is .exe", () => {
  expect(binaryFileName("win32")).toBe("create-gb-app.exe");
  expect(binaryFileName("linux")).toBe("create-gb-app");
  expect(binaryFileName("darwin")).toBe("create-gb-app");
});

test("npm fallback uses npm.cmd on win32", () => {
  expect(npmCli("win32")).toBe("npm.cmd");
  expect(npmCli("linux")).toBe("npm");
});

test("published wrapper bin is a node launcher and lists musl without OpenTUI deps", () => {
  const manifest = wrapperPackageJson(defaultBinaryVersions(), "0.0.0");
  expect(manifest.bin["create-gb-app"]).toBe("./bin/create-gb-app.mjs");
  expect(manifest.optionalDependencies["create-gb-app-linux-x64-musl"]).toBe("0.0.0");
  expect(JSON.stringify(manifest)).not.toContain("@opentui");
  expect("dependencies" in manifest).toBe(false);
});
