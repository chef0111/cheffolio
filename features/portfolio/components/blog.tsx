import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import { GridDivider } from '@/components/cheffolio/grid-divider';
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from '@/components/cheffolio/panel';
import { Button } from '@/components/ui/button';
import { BlogItem } from '@/features/blog/components/blog-item';
import { getAllBlogs } from '@/features/blog/lib/data';
import { getRowCounts } from '@/utils/grid';

export function Blog() {
  const blogPosts = getAllBlogs();
  const rows = getRowCounts(blogPosts.length, 2);

  return (
    <Panel id="blog" className="screen-line-bottom-none screen-line-top-none">
      <PanelHeader className="decor-b">
        <PanelTitle>
          Blog
          <PanelTitleSup>({blogPosts.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="px-0">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-border border-r"></div>
          <div className="border-border border-l"></div>
        </div>

        <GridDivider className="gap-4 max-sm:hidden" rows={rows} />

        <ul className="border-border grid grid-cols-1 gap-4 border-y sm:grid-cols-2">
          {blogPosts.slice(0, 4).map((blog) => (
            <li key={blog.slug} className="group">
              <BlogItem blog={blog} heading="h3" loading="lazy" />
              <div className="border-border h-4 w-full border-y group-last:hidden sm:hidden" />
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
