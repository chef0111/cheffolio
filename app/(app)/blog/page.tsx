import type { Metadata } from 'next';
import { Suspense } from 'react';
import type { Blog, WithContext } from 'schema-dts';

import { simpleOgImageUrl } from '@/app/og/params';
import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from '@/components/cheffolio/page-heading';
import { StripeSeparator } from '@/components/cheffolio/stripe-separator';
import { jsonLdBreadcrumbList, JsonLdScript } from '@/components/json-ld';
import { JSON_LD_ID } from '@/config/json-ld';
import { X_PROFILE } from '@/config/site';
import { BlogList } from '@/features/blog/components/blog-list';
import { BlogListFiltered } from '@/features/blog/components/blog-list-filtered';
import {
  BlogSearchInput,
  SearchInput,
} from '@/features/blog/components/blog-search-input';
import { getAllBlogs } from '@/features/blog/lib/data';
import { absoluteUrl } from '@/lib/utils';

const title = 'Blog';
const description =
  'Ideas, experiments, and insights from my journey as a developer.';

const ogImage = simpleOgImageUrl(title, description);

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    url: '/blog',
    type: 'website',
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

function getBlogJsonLd(
  posts: { slug: string; metadata: { title: string; createdAt: string } }[]
): WithContext<Blog> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': absoluteUrl('/blog'),
    name: title,
    description,
    url: absoluteUrl('/blog'),
    isPartOf: { '@id': JSON_LD_ID.website },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      '@id': absoluteUrl(`/blog/${post.slug}`),
      headline: post.metadata.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: new Date(post.metadata.createdAt).toISOString(),
    })),
  };
}

export default function BlogsPage() {
  const blogPosts = getAllBlogs();

  return (
    <>
      <JsonLdScript data={getBlogJsonLd(blogPosts)} />

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
        ])}
      />

      <div className="flex flex-1 flex-col">
        <PageHeading className="pt-24">
          <PageHeadingTagline>{title}</PageHeadingTagline>
          <PageHeadingTitle className="decor-all screen-line-bottom-none">
            {description}
          </PageHeadingTitle>
        </PageHeading>

        <StripeSeparator />

        <div className="border-x p-2">
          <Suspense fallback={<SearchInput />}>
            <BlogSearchInput />
          </Suspense>
        </div>

        <Suspense fallback={<BlogList blogs={blogPosts} />}>
          <BlogListFiltered blogs={blogPosts} />
        </Suspense>
      </div>
      <StripeSeparator />
    </>
  );
}
