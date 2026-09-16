import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

export type CompileTarget = {
  os: "linux" | "darwin" | "win32";
  arch: "arm64" | "x64";
  abi?: "musl";
  avx2?: false;
};

export function binaryFileName(os: CompileTarget["os"]): string {
  return os === "win32" ? "create-gb-app.exe" : "create-gb-app";
}

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

function hostIsMusl(): boolean {
  if (process.platform !== "linux") {
    return false;
  }
  try {
    if (existsSync("/etc/alpine-release")) {
      return true;
    }
  } catch {
    // ignore
  }
  try {
    const result = spawnSync("ldd", ["--version"], { encoding: "utf8" });
    return `${result.stdout || ""}${result.stderr || ""}`.toLowerCase().includes("musl");
  } catch {
    return false;
  }
}

export function detectAvx2(): boolean | null {
  if (process.arch !== "x64") {
    return true;
  }
  if (process.platform === "linux") {
    try {
      return /(^|\s)avx2(\s|$)/i.test(readFileSync("/proc/cpuinfo", "utf8"));
    } catch {
      return null;
    }
  }
  if (process.platform === "darwin") {
    const leaf7 = spawnSync("sysctl", ["-n", "machdep.cpu.leaf7_features"], {
      encoding: "utf8",
    });
    if (leaf7.status === 0) {
      return /\bAVX2\b/i.test(leaf7.stdout || "");
    }
    const features = spawnSync("sysctl", ["-n", "machdep.cpu.features"], {
      encoding: "utf8",
    });
    if (features.status !== 0) {
      return null;
    }
    return /\bAVX2\b/i.test(features.stdout || "");
  }
  if (process.platform === "win32") {
    for (const exe of ["pwsh.exe", "powershell.exe"] as const) {
      const result = spawnSync(
        exe,
        ["-NoProfile", "-Command", "[System.Runtime.Intrinsics.X86.Avx2]::IsSupported"],
        { encoding: "utf8", windowsHide: true, timeout: 5000 },
      );
      const text = (result.stdout || "").trim();
      if (/^True$/i.test(text)) {
        return true;
      }
      if (/^False$/i.test(text)) {
        return false;
      }
    }
    return null;
  }
  return null;
}

export function hostTarget(): CompileTarget {
  const os: CompileTarget["os"] =
    process.platform === "win32" || process.platform === "darwin" || process.platform === "linux"
      ? process.platform
      : "linux";
  const arch: CompileTarget["arch"] = process.arch === "arm64" ? "arm64" : "x64";
  const target: CompileTarget = { os, arch };
  if (os === "linux" && hostIsMusl()) {
    target.abi = "musl";
  }
  if (arch === "x64" && detectAvx2() === false) {
    target.avx2 = false;
  }
  return target;
}
