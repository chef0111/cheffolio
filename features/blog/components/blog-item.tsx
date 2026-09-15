import { format } from 'date-fns';
import { CalendarIcon, ChevronRightIcon } from 'lucide-react';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';

import { Tag } from '@/components/ui/tag';
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
    <div className="group/post hover:bg-accent-muted active:bg-accent-muted relative flex h-full flex-col gap-2 p-2 transition-[background-color] ease-out">
      {blog.metadata.image && (
        <div className="relative select-none [--image-radius:var(--radius-xl)]">
          <Image
            className="ease-out-cubic aspect-40/21 rounded-(--image-radius) grayscale transition-[filter] duration-300 group-hover/post:grayscale-0"
            src={blog.metadata.image}
            alt={blog.metadata.title}
            width={1200}
            height={630}
            loading={loading}
          />
          <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
        </div>
      )}

      <div className="flex flex-col gap-2 p-2">
        <Heading className="text-lg leading-snug font-medium text-pretty">
          <Link
            href={`/blog/${blog.slug}`}
            aria-label={`Read ${blog.metadata.title}`}
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

        {blog.metadata.tags && blog.metadata.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {blog.metadata.tags.map((tag, index) => (
              <li key={index} className="flex">
                <Tag className="capitalize">{tag}</Tag>
              </li>
            ))}
          </ul>
        )}

        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              <time dateTime={new Date(blog.metadata.createdAt).toISOString()}>
                {format(new Date(blog.metadata.createdAt), 'dd-MM-yyyy')}
              </time>
            </dd>
          </dl>
          <span className="group-hover/post:text-foreground flex items-center gap-1.5 transition-colors">
            Read more
            <ChevronRightIcon className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
