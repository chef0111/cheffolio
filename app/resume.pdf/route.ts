import { notFound } from 'next/navigation';

import { RESUME_PDF_FILENAME } from '@/config/resume';
import { renderResumePdf } from '@/features/resume/lib/render-resume-pdf';
import { getResumeDoc } from '@/lib/document';

export async function GET() {
  const doc = getResumeDoc();

  if (!doc) notFound();

  const pdf = await renderResumePdf(doc);

  // Copy into a plain ArrayBuffer-backed view; Takumi may hand back a SharedArrayBuffer-typed array.
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${RESUME_PDF_FILENAME}"`,
    },
  });
}
