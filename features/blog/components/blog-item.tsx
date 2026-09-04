import { format } from 'date-fns';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';

import type { Blog } from '../types/blog';

type HeadingTypes = 'h2' | 'h3' | 'h4';

export function BlogItem({
  blog,
  headingAs,
  loading = 'lazy',
}: {
  blog: Blog;
  headingAs?: HeadingTypes;
  loading?: ImageProps['loading'];
}) {
  const Heading = headingAs ?? 'h2';

  return (
    <div className="group/post hover:bg-accent-muted relative flex h-full flex-col gap-2 p-2 transition-[background-color] ease-out">
      {blog.metadata.image && (
        <div className="relative select-none [--image-radius:var(--radius-xl)]">
          <Image
            className="aspect-1200/630 rounded-(--image-radius) grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/post:grayscale-0"
            src={blog.metadata.image}
            alt={blog.metadata.title}
            width={1200}
            height={630}
            loading={loading}
          />
          <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
        </div>
      )}

      <div className="flex flex-col gap-1 p-2">
        <Heading className="text-lg leading-snug font-medium text-balance">
          <Link href={`/blog/${blog.slug}`}>
            <span className="absolute inset-0" aria-hidden />
            {blog.metadata.title}
          </Link>

          {(blog.metadata.new || blog.metadata.updated) && (
            <span className="bg-info pointer-events-none ml-2 inline-block size-2 -translate-y-px rounded-full">
              <span className="sr-only">
                {blog.metadata.new ? ' (New)' : ' (Updated)'}
              </span>
            </span>
          )}
        </Heading>

        <dl>
          <dt className="sr-only">Published on</dt>
          <dd className="text-muted-foreground text-sm">
            <time dateTime={new Date(blog.metadata.createdAt).toISOString()}>
              {format(new Date(blog.metadata.createdAt), 'dd.MM.yyyy')}
            </time>
          </dd>
        </dl>
      </div>
    </div>
  );
}
