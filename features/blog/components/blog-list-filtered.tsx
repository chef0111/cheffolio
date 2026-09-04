'use client';

import { useFilteredBlogs } from '../hooks/use-filtered-blogs';
import type { Blog } from '../types/blog';
import { BlogList } from './blog-list';

export function BlogListFiltered({ blogs }: { blogs: Blog[] }) {
  const filteredBlogs = useFilteredBlogs(blogs);
  return <BlogList blogs={filteredBlogs} />;
}
