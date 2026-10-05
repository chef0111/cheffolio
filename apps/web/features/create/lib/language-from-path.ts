export function languageFromPath(path: string): string {
  const base = path.split('/').pop() ?? path;
  const dot = base.lastIndexOf('.');
  if (dot <= 0) {
    return base.replace(/^\./, '') || 'txt';
  }
  return base.slice(dot + 1);
}
