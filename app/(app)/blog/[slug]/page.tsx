import { getTableOfContents } from 'fumadocs-core/content/toc';
import { ArrowLeftIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { BlogPosting, WithContext } from 'schema-dts';

import { simpleOgImageUrl } from '@/app/og/params';
import { Panel } from '@/components/cheffolio/panel';
import { StripeSeparator } from '@/components/cheffolio/stripe-separator';
import { jsonLdBreadcrumbList, JsonLdScript } from '@/components/json-ld';
import { Button } from '@/components/ui/button';
import { JSON_LD_ID } from '@/config/json-ld';
import { X_PROFILE } from '@/config/site';
import { DocContainer } from '@/features/blog/components/doc/doc-layout';
import { LLMCopyButtonGroup } from '@/features/blog/components/doc/doc-page-actions';
import { DocPageRoot } from '@/features/blog/components/doc/doc-page-root';
import { getAllBlogs, getBlogBySlug } from '@/features/blog/lib/data';
import type { Blog } from '@/features/blog/types/blog';
import { absoluteUrl } from '@/lib/utils';

export function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  'use cache';
  cacheLife('max');

  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) return notFound();

  const { title, description, image, createdAt, updatedAt } = blog.metadata;

  const blogUrl = `/blog/${blog.slug}`;
  const ogImage = image ?? simpleOgImageUrl(title, description);

  return {
    title,
    description,
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      url: blogUrl,
      type: 'article',
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: 'summary_large_image',
      site: X_PROFILE,
      creator: X_PROFILE,
      images: [ogImage],
    },
  };
}

function getPageJsonLd(blog: Blog): WithContext<BlogPosting> {
  const blogUrl = `/blog/${blog.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': absoluteUrl(blogUrl),
    headline: blog.metadata.title,
    description: blog.metadata.description,
    image:
      blog.metadata.image ??
      absoluteUrl(
        simpleOgImageUrl(blog.metadata.title, blog.metadata.description)
      ),
    url: absoluteUrl(blogUrl),
    datePublished: new Date(blog.metadata.createdAt).toISOString(),
    dateModified: new Date(blog.metadata.updatedAt).toISOString(),
    author: { '@id': JSON_LD_ID.person },
    mainEntityOfPage: absoluteUrl(blogUrl),
    isPartOf: {
      '@type': 'Blog',
      '@id': absoluteUrl('/blog'),
      name: 'Blog',
      url: absoluteUrl('/blog'),
    },
  };
}

export default async function BlogPage({ params }: PageProps<'/blog/[slug]'>) {
  'use cache';
  cacheLife('max');

  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) return notFound();

  const toc = getTableOfContents(blog.content);

  return (
    <>
      <JsonLdScript data={getPageJsonLd(blog)} />
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: 'Home',
            href: '/',
          },
          {
            name: 'Blog',
            href: '/blog',
          },
          {
            name: blog.metadata.title,
            href: `/blog/${slug}`,
          },
        ])}
      />

      <DocPageRoot>
        <div className="mx-auto h-26 max-w-4xl border-x" />
        <DocContainer>
          <Panel className="decor-t screen-line-bottom-none flex items-center justify-between p-2">
            <Button
              size="sm"
              variant="ghost"
              nativeButton={false}
              className="text-muted-foreground gap-1.5 text-base tracking-wider"
              render={<Link href="/blog" />}
            >
              <ArrowLeftIcon data-icon="inline-start" className="size-4" />
              Blog
            </Button>

            <div className="flex items-center gap-2">
              <LLMCopyButtonGroup markdownUrl={`/blog/${blog.slug}.md`} />
            </div>
          </Panel>

          <StripeSeparator />
        </DocContainer>
      </DocPageRoot>
    </>
  );
}
