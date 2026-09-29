import { format } from 'date-fns';
import { CalendarIcon, ChevronRightIcon } from 'lucide-react';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';

import { GridPattern } from '@/components/cheffolio/grid-pattern';
import { AdaptiveRing } from '@/components/ui/adaptive-ring';
import { Tag } from '@/components/ui/tag';
import {
  BLOG_NAV_FORWARD,
  BlogOgTransition,
} from '@/features/blog/components/blog-og-transition';
import type { Doc } from '@/types/document';

type Heading = 'h2' | 'h3' | 'h4';

export function BlogItem({
  blog,
  heading,
  loading = 'lazy',
}: {
  blog: Doc;
  heading?: Heading;
  loading?: ImageProps['loading'];
}) {
  const Heading = heading ?? 'h2';

  return (
    <div className="group/post hover:bg-accent-muted active:bg-accent-muted relative flex items-center overflow-hidden transition-[background-color] ease-out">
      <div
        className="pointer-events-none absolute inset-y-0 left-68 -z-1 w-px bg-[linear-gradient(to_bottom,var(--border)_4px,transparent_2px)] bg-size-[1px_6px] bg-repeat-y max-md:hidden max-sm:hidden"
        aria-hidden
      />

      <div className="p-4 max-md:hidden">
        {blog.metadata.image && (
          <BlogOgTransition slug={blog.slug}>
            <div className="relative select-none">
              <Image
                className="ease-out-cubic aspect-40/21 max-w-60 grayscale transition-[filter] duration-300 group-hover/post:grayscale-0"
                src={blog.metadata.image}
                alt={blog.metadata.title}
                width={400}
                height={210}
                loading={loading}
              />
              <AdaptiveRing />
            </div>
          </BlogOgTransition>
        )}
      </div>

      <div className="flex flex-col gap-1 p-4">
        <dl className="mb-2">
          <dt className="sr-only">Published on</dt>
          <dd className="text-muted-foreground flex items-center gap-2 text-xs">
            <CalendarIcon className="size-3.5" />
            <time dateTime={new Date(blog.metadata.createdAt).toISOString()}>
              {format(new Date(blog.metadata.createdAt), 'MMMM dd, yyyy')}
            </time>
          </dd>
        </dl>

        <Heading className="text-lg leading-snug font-medium text-pretty">
          <Link
            href={`/blog/${blog.slug}`}
            aria-label={`Read ${blog.metadata.title}`}
            transitionTypes={[BLOG_NAV_FORWARD]}
          >
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

        <p className="text-muted-foreground text-sm text-pretty">
          {blog.metadata.description}
        </p>

        <div className="text-muted-foreground mt-2 flex items-center justify-between text-sm">
          {blog.metadata.tags && blog.metadata.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {blog.metadata.tags.map((tag, index) => (
                <li key={index} className="flex">
                  <Tag className="capitalize">{tag}</Tag>
                </li>
              ))}
            </ul>
          )}
          <span className="group-hover/post:text-foreground flex items-center gap-1.5 transition-colors">
            Read more
            <ChevronRightIcon className="size-4" />
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full mask-[radial-gradient(farthest-side_at_top,white,transparent)]">
        <GridPattern
          className="stroke-border absolute inset-0 size-full"
          height={25}
          width={25}
          x={2}
          y={7}
        />
      </div>
    </div>
  );
}
