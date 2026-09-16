export type CompileTarget = {
  os: "linux" | "darwin" | "win32";
  arch: "arm64" | "x64";
  abi?: "musl";
  avx2?: false;
};

export const ALL_TARGETS: CompileTarget[] = [
  { os: "linux", arch: "arm64" },
  { os: "linux", arch: "x64" },
  { os: "linux", arch: "x64", avx2: false },
  { os: "linux", arch: "arm64", abi: "musl" },
  { os: "linux", arch: "x64", abi: "musl" },
  { os: "linux", arch: "x64", abi: "musl", avx2: false },
  { os: "darwin", arch: "arm64" },
  { os: "darwin", arch: "x64" },
  { os: "darwin", arch: "x64", avx2: false },
  { os: "win32", arch: "arm64" },
  { os: "win32", arch: "x64" },
  { os: "win32", arch: "x64", avx2: false },
];

export function npmOs(os: CompileTarget["os"]): string {
  return os === "win32" ? "windows" : os;
}

export function platformPackageName(target: CompileTarget, pkgName = "create-gb-app"): string {
  return [
    pkgName,
    npmOs(target.os),
    target.arch,
    target.avx2 === false ? "baseline" : undefined,
    target.abi,
  ]
    .filter(Boolean)
    .join("-");
}

export function bunCompileTarget(target: CompileTarget): string {
  return [
    "bun",
    target.os === "win32" ? "windows" : target.os,
    target.arch,
    target.avx2 === false ? "baseline" : undefined,
    target.abi,
  ]
    .filter(Boolean)
    .join("-");
}

export function hostTarget(): CompileTarget {
  const os = process.platform === "win32" || process.platform === "darwin" || process.platform === "linux"
    ? process.platform
    : "linux";
  const arch = process.arch === "arm64" ? "arm64" : "x64";
  return { os, arch };
}
