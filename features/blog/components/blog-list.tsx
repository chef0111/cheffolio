import { SearchXIcon } from 'lucide-react';

import { getRowCounts, GridDivider } from '@/components/cheffolio/grid-divider';
import { Panel, PanelContent } from '@/components/cheffolio/panel';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

import type { Blog } from '../types/blog';
import { BlogItem } from './blog-item';

function Divider({
  className,
  position,
}: {
  className?: string;
  position: 'top' | 'bottom';
}) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute right-0 left-0 -z-1 grid h-4 grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
    >
      <div className="border-r" />
      <div className="border-l" />
    </div>
  );
}

export function BlogList({ blogs }: { blogs: Blog[] }) {
  const { mobile, desktop } = getRowCounts(blogs.length, 1, 2);
  const isEmpty = blogs.length === 0;

  return (
    <Panel className="screen-line-bottom-none decor-t flex-1 py-4">
      <Divider position="top" />
      <PanelContent className="relative flex flex-1 flex-col border-y p-0">
        {isEmpty ? (
          <Empty className="absolute top-4">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchXIcon />
              </EmptyMedia>
              <EmptyTitle>No posts found.</EmptyTitle>
              <EmptyDescription>
                Post list is either empty or not match.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 -z-1 hidden grid-cols-2 gap-4 sm:grid">
              <div className="border-r" />
              <div className="border-l" />
            </div>

            <GridDivider className="gap-4 max-sm:hidden" rows={desktop} />
            <GridDivider className="hidden gap-4 max-sm:grid" rows={mobile} />

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {blogs.map((blog, index) => (
                <li key={blog.slug}>
                  <BlogItem
                    blog={blog}
                    loading={index <= 3 ? 'eager' : 'lazy'}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </PanelContent>

      {blogs.length > 2 && <Divider position="bottom" />}
    </Panel>
  );
}
