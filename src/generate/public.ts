export { CompatError, RULE_IDS } from "../stack/errors.ts";
export { ParseError } from "../stack/parse-error.ts";
export { resolveStack, YES_DEFAULTS } from "../stack/resolve.ts";
export type {
  Api,
  Auth,
  Backend,
  Database,
  DbSetup,
  Frontend,
  Linter,
  Orm,
  Payments,
  PresetFields,
  RawFlags,
  Stack,
  Ui,
} from "../stack/types.ts";
export {
  APIS,
  AUTHS,
  BACKENDS,
  DATABASES,
  DB_SETUPS,
  FLAG_GROUPS,
  FRONTENDS,
  LINTERS,
  ORMS,
  PAYMENTS,
  UIS,
} from "../stack/vocab.ts";
export { decodePreset, encodePreset, rawFlagsFromPreset } from "../preset.ts";
export type { PresetCode } from "../preset.ts";
export { buildTree } from "./build-tree.ts";
export { GENERATE_GAPS, GenerateError } from "./errors.ts";
export type { GenerateGapCode } from "./errors.ts";
export type { FileMap, GenerateContext, PackageManager } from "./types.ts";
