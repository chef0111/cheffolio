import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from '@/components/app/panel';
import { Button } from '@/components/ui/button';
import { BlogItem } from '@/features/blog/components/blog-item';
import { getBlogPosts } from '@/lib/document';

export function Blog() {
  const blogPosts = getBlogPosts();

  return (
    <Panel id="blog" className="screen-line-bottom-none screen-line-top-none">
      <PanelHeader className="decor-b">
        <PanelTitle>
          Blog
          <PanelTitleSup>({blogPosts.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="relative px-0">
        <ul className="flex flex-col border-y">
          {blogPosts.map((blog) => (
            <li
              key={blog.slug}
              className="group border-b last:border-b-0 last:border-none"
            >
              <BlogItem heading="h2" blog={blog} loading="lazy" />
            </li>
          ))}
        </ul>
      </PanelContent>

      <div className="flex justify-center border-t py-4">
        <Button
          size="sm"
          nativeButton={false}
          render={<Link href="/blog" aria-label="View all blog posts" />}
        >
          All posts
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  );
}
