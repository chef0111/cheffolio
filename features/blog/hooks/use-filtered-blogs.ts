'use client';

import type { Doc } from '@/types/document';

import { useSearchQuery } from './use-search-query';

const normalize = (text: string) => text.toLowerCase().replaceAll(' ', '');

const matchesQuery = (post: Doc, normalizedQuery: string) => {
  const normalizedTitle = normalize(post.metadata.title);
  const normalizedDescription = normalize(post.metadata.description);

  return (
    normalizedTitle.includes(normalizedQuery) ||
    normalizedDescription.includes(normalizedQuery)
  );
};

const searchBlogs = (posts: Doc[], query: string | null) => {
  if (!query) return posts;

  const normalizedQuery = normalize(query);
  return posts.filter((post) => matchesQuery(post, normalizedQuery));
};

export function useFilteredBlogs(posts: Doc[]) {
  const { query } = useSearchQuery();
  return searchBlogs(posts, query);
}
