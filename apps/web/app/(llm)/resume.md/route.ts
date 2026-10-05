import { notFound } from 'next/navigation';

import { getResumeDoc } from '@/lib/document';
import { processMdxForLLMs } from '@/lib/process-mdx';

export async function GET() {
  const doc = getResumeDoc();

  if (!doc) notFound();

  return new Response(await processMdxForLLMs(doc), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  });
}
