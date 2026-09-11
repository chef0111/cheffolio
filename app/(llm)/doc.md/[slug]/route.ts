import { cacheLife } from 'next/cache';
import { notFound } from 'next/navigation';

import { getAllDocs } from '@/lib/document';
import { processMdxForLLMs } from '@/lib/process-mdx';

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({
    slug: doc.slug,
  }));
}

async function getCachedDoc(slug: string) {
  'use cache';
  cacheLife('max');

  const allDocs = getAllDocs();
  return allDocs.find((doc) => doc.slug === slug);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const doc = await getCachedDoc(slug);

  if (!doc) {
    notFound();
  }

  return new Response(await processMdxForLLMs(doc), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  });
}
