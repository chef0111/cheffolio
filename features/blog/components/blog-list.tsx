import { FileTextIcon, SearchXIcon } from 'lucide-react';

import { GridDivider } from '@/components/cheffolio/grid-divider';
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

export function BlogListEmpty() {
  return (
    <BlogListEmptyState
      icon={<FileTextIcon />}
      title="No posts yet."
      description="Nothing has been published here."
    />
  );
}

export function BlogListNoResults() {
  return (
    <BlogListEmptyState
      icon={<SearchXIcon />}
      title="No posts found."
      description="Try a different search, or clear the query."
    />
  );
}

export function BlogList({
  blogs,
  empty = <BlogListEmpty />,
}: {
  blogs: Blog[];
  empty?: React.ReactNode;
}) {
  const isEmpty = blogs.length === 0;

  return (
    <Panel className="screen-line-bottom-none decor-t flex-1 py-4">
      <ColumnDivider className="relative -mt-4 h-4" />

      <PanelContent className="bg-background relative border-y p-0">
        {isEmpty ? (
          empty
        ) : (
          <>
            <ColumnDivider className="z-1" />
            <GridDivider className="gap-4 max-sm:hidden" rows={2} />
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {blogs.map((blog, index) => (
                <li key={blog.slug} className="group">
                  <BlogItem
                    blog={blog}
                    loading={index <= 3 ? 'eager' : 'lazy'}
                  />
                  <div className="border-border h-4 w-full border-y group-last:hidden sm:hidden" />
                </li>
              ))}
            </ul>
          </>
        )}
      </PanelContent>

      <ColumnDivider />
    </Panel>
  );
}

function BlogListEmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Empty className="py-26.5">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function ColumnDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 -z-1 hidden grid-cols-2 gap-4 sm:grid',
        className
      )}
    >
      <div className="border-r" />
      <div className="border-l" />
    </div>
  );
}
