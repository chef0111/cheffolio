import { cacheLife } from 'next/cache';
import { notFound } from 'next/navigation';

import { getAllBlogs, getBlogBySlug } from '@/features/blog/lib/data';
import { getMarkdownText } from '@/features/blog/lib/get-md-text';

export function generateStaticParams() {
  return getAllBlogs().map((blog) => ({
    slug: blog.slug,
  }));
}

async function getCachedMarkdown(slug: string) {
  'use cache';
  cacheLife('max');

  const post = getBlogBySlug(slug);
  if (!post) return null;

  return getMarkdownText(post);
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
