import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { connection } from 'next/server';

import { RESUME_PDF_FILENAME } from '@/config/resume';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return new Response(null, { status: 404 });
  }

  await connection();

  // Run the existing Bun renderer without bundling it into Next.js.
  const { stdout: pdf } = await promisify(execFile)(
    'bun',
    ['run', '--bun', './scripts/render-resume-pdf.ts', '--stdout'],
    { encoding: 'buffer' }
  );

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${RESUME_PDF_FILENAME}"`,
      'Cache-Control': 'no-store',
    },
  });
}
