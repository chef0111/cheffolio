export function setFile(
  files: Record<string, string>,
  path: string,
  content: string,
): void {
  files[path] = content.endsWith("\n") ? content : `${content}\n`;
}

export function sortRecord(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record).sort(([left], [right]) => left.localeCompare(right)),
  );
}
