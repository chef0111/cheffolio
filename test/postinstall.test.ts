import { expect, test } from "bun:test";
import { packageNamesFor } from "../script/postinstall.mjs";
import { defaultBinaryVersions, wrapperPackageJson } from "../script/publish.ts";

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

test("published wrapper bin is .exe and lists musl without OpenTUI deps", () => {
  const manifest = wrapperPackageJson(defaultBinaryVersions(), "0.0.0");
  expect(manifest.bin["create-gb-app"]).toBe("./bin/create-gb-app.exe");
  expect(manifest.optionalDependencies["create-gb-app-linux-x64-musl"]).toBe("0.0.0");
  expect(JSON.stringify(manifest)).not.toContain("@opentui");
  expect("dependencies" in manifest).toBe(false);
});
