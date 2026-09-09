import { cacheLife } from 'next/cache';
import { notFound } from 'next/navigation';

import { getAllDocs, getDocBySlug } from '@/lib/document';
import { getMarkdownText } from '@/lib/get-md-text';

export function generateStaticParams() {
  return getAllDocs().map((blog) => ({
    slug: blog.slug,
  }));
}

async function getCachedMarkdown(slug: string) {
  'use cache';
  cacheLife('max');

  const blog = getDocBySlug(slug);
  if (!blog) return null;

  return getMarkdownText(blog);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const markdown = await getCachedMarkdown(slug);

  if (!markdown) {
    notFound();
  }

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  });
}
