export type FileMap = Record<string, string>;

export function defaultSelectedPath(paths: readonly string[]): string | null {
  if (paths.includes('package.json')) {
    return 'package.json';
  }
  if (paths.includes('README.md')) {
    return 'README.md';
  }
  const sorted = [...paths].sort();
  return sorted[0] ?? null;
}
