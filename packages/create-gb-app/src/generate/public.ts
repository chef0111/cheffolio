export { buildTree } from '#/generate/build-tree';
export type { GenerateGapCode } from '#/generate/errors';
export { GENERATE_GAPS, GenerateError } from '#/generate/errors';
export {
  isPackageManager,
  PACKAGE_MANAGER_METADATA,
} from '#/generate/package-managers';
export type { PresetCode } from '#/preset';
export { decodePreset, encodePreset, rawFlagsFromPreset } from '#/preset';
export { CompatError, RULE_IDS } from '#/stack/errors';
export { ParseError } from '#/stack/parse-error';
export {
  defaultStructureForBackend,
  resolveStack,
  YES_DEFAULTS,
} from '#/stack/resolve';
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
  PROJECT_STRUCTURES,
} from '#/stack/vocab';
export type {
  FileMap,
  GenerateContext,
  PackageManager,
} from '#/types/generate';
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
  ProjectStructure,
  RawFlags,
  Stack,
} from '#/types/stack';
