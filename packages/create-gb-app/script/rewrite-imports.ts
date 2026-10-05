#!/usr/bin/env bun

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dir, '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'media']);
const SOURCE = /\.(ts|tsx|mts)$/;
const SPECIFIER =
  /(\bfrom\s+|import\s*\(|(?:^|\n)import\s+)\s*(['"])([^'"]+)\.(ts|tsx)\2/g;

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) {
      continue;
    }
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
      continue;
    }
    if (SOURCE.test(entry.name)) {
      files.push(path);
    }
  }
  return files;
}

const files = await walk(ROOT);
let changed = 0;
for (const file of files) {
  const before = await readFile(file, 'utf8');
  const after = before.replace(SPECIFIER, '$1$2$3$2');
  if (after === before) {
    continue;
  }
  await writeFile(file, after);
  changed += 1;
}

console.log(`rewrote ${changed} files`);
