import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { S3Client } from 'bun';

const CONTENT_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

const DEFAULT_CONTENT_TYPE = 'application/octet-stream';

export function getR2ClientFromEnv() {
  const { R2_S3_API, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } =
    process.env;

  const missing = (
    [
      ['R2_S3_API', R2_S3_API],
      ['R2_ACCESS_KEY_ID', R2_ACCESS_KEY_ID],
      ['R2_SECRET_ACCESS_KEY', R2_SECRET_ACCESS_KEY],
      ['R2_BUCKET', R2_BUCKET],
    ] as const
  )
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }

  return new S3Client({
    endpoint: R2_S3_API,
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    bucket: R2_BUCKET,
  });
}

export type SyncDirToR2Options = {
  client: S3Client;
  dir: string;
  prefix?: string;
  extensions?: string[];
};

export async function syncDirToR2({
  client,
  dir,
  prefix = '',
  extensions,
}: SyncDirToR2Options): Promise<string[]> {
  if (!existsSync(dir)) {
    throw new Error(`Directory not found: ${dir}`);
  }

  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, '');
  const uploadedKeys: string[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const absPath = path.join(entry.parentPath, entry.name);
    const segments = path.relative(dir, absPath).split(path.sep);

    if (segments.some((segment) => segment.startsWith('.'))) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (extensions && !extensions.includes(ext)) continue;

    const objectPath = segments.join('/');
    const key = normalizedPrefix
      ? `${normalizedPrefix}/${objectPath}`
      : objectPath;
    const contentType = CONTENT_TYPES[ext] ?? DEFAULT_CONTENT_TYPE;

    const buffer = await readFile(absPath);
    await client.write(key, buffer, { type: contentType });

    uploadedKeys.push(key);
  }

  return uploadedKeys;
}
