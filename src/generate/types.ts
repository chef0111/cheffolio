import type { Stack } from "../stack/types.ts";

export type FileMap = Record<string, string>;

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export type GenerateContext = {
  projectName: string;
  packageManager: PackageManager;
};

export type PackageJsonShape = {
  name: string;
  private: true;
  type: "module";
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

export type EmitCtx = GenerateContext & {
  files: FileMap;
  pkg: PackageJsonShape;
  stack: Stack;
};
