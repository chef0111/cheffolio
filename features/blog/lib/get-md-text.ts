import { format } from 'date-fns';
import { remarkHeading } from 'fumadocs-core/mdx-plugins/remark-heading';
import { cacheLife } from 'next/cache';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';

import type { Blog } from '../types/blog';

const processor = remark().use(remarkMdx).use(remarkGfm).use(remarkHeading);

export async function getMarkdownText(blog: Blog) {
  'use cache';
  cacheLife('max');

  const processed = await processor.process({
    value: blog.content,
  });

  return `# ${blog.metadata.title}

${blog.metadata.description}

${processed.value}

Last updated on ${format(new Date(blog.metadata.updatedAt), 'MMMM d, yyyy')}`;
}
