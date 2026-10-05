import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { renderResumePdf } from '../features/resume/lib/render-resume-pdf';
import { getResumeDoc } from '../lib/document';

const OUTPUT_PATH = path.join(process.cwd(), 'public/resume.pdf');

const doc = getResumeDoc();

if (!doc) {
  throw new Error('No resume MDX found under docs/resume/');
}

const pdf = await renderResumePdf(doc);

if (process.argv.includes('--stdout')) {
  process.stdout.write(pdf);
} else {
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, pdf);

  console.log(`Wrote ${OUTPUT_PATH} (${pdf.byteLength} bytes)`);
}
