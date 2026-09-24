import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import type { FileMap } from '#/types/generate';

export async function writeTree(dest: string, files: FileMap): Promise<void> {
  const root = resolve(dest);
  await mkdir(root, { recursive: true });
  const existing = await readdir(root);
  if (existing.length > 0) {
    throw new Error(`destination ${root} is not empty`);
  }

  for (const [rel, content] of Object.entries(files)) {
    const abs = join(root, rel);
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, content, 'utf8');
  }
}
