'use client';

import type { Doc } from '@/types/document';

import { useFilteredBlogs } from '../hooks/use-filtered-blogs';
import { BlogList, BlogListEmpty, BlogListNoResults } from './blog-list';

export function BlogListFiltered({ blogs }: { blogs: Doc[] }) {
  const filteredBlogs = useFilteredBlogs(blogs);

  return (
    <BlogList
      blogs={filteredBlogs}
      empty={blogs.length === 0 ? <BlogListEmpty /> : <BlogListNoResults />}
    />
  );
}
