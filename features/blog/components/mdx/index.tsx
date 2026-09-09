import { remarkHeading } from 'fumadocs-core/mdx-plugins/remark-heading';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ComponentProps } from 'react';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import remarkCodeImport from 'remark-code-import';
import remarkGfm from 'remark-gfm';

import { Code, Heading } from '@/components/ui/typography';
import { UTM_PARAMS } from '@/config/site';
import { rehypeAddQueryParams } from '@/lib/rehype-add-query-params';
import {
  rehypeCodeRawString,
  rehypeHighlightCode,
  rehypeHighlightCodeRawString,
} from '@/lib/rehype-code-block';

import { FramedImage } from './embed';
import { mdxCodeBlockComponents } from './mdx-code-block';

const components: MDXRemoteProps['components'] = {
  h1: (props: ComponentProps<'h1'>) => <Heading as="h1" {...props} />,
  h2: (props: ComponentProps<'h2'>) => <Heading as="h2" {...props} />,
  h3: (props: ComponentProps<'h3'>) => <Heading as="h3" {...props} />,
  h4: (props: ComponentProps<'h4'>) => <Heading as="h4" {...props} />,
  h5: (props: ComponentProps<'h5'>) => <Heading as="h5" {...props} />,
  h6: (props: ComponentProps<'h6'>) => <Heading as="h6" {...props} />,
  ...mdxCodeBlockComponents,
  code: Code,
  FramedImage,
};

const options: MDXRemoteProps['options'] = {
  mdxOptions: {
    remarkPlugins: [
      remarkGfm,
      [remarkCodeImport, { async: false, rootDir: process.cwd() }],
      remarkHeading,
    ],
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: 'nofollow noopener' }],
      rehypeSlug,
      rehypeCodeRawString,
      rehypeHighlightCode,
      rehypeHighlightCodeRawString,
      [rehypeAddQueryParams, UTM_PARAMS],
    ],
  },
};

export function MDX({ content }: { content: string }) {
  return (
    <MDXRemote
      // remark-code-import requires VFile.dirname. A string source has none.
      source={{ value: content, path: 'mdx.mdx' }}
      components={components}
      options={options}
    />
  );
}
