import type { Blog } from '../types/blog';
import { useSearchQuery } from './use-search-query';

const normalize = (text: string) => text.toLowerCase().replaceAll(' ', '');

const matchesQuery = (post: Blog, normalizedQuery: string) => {
  const normalizedTitle = normalize(post.metadata.title);
  const normalizedDescription = normalize(post.metadata.description);

  return (
    normalizedTitle.includes(normalizedQuery) ||
    normalizedDescription.includes(normalizedQuery)
  );
};

const searchBlogs = (posts: Blog[], query: string | null) => {
  if (!query) return posts;

  const normalizedQuery = normalize(query);
  return posts.filter((post) => matchesQuery(post, normalizedQuery));
};

export function useFilteredBlogs(posts: Blog[]) {
  const { query } = useSearchQuery();
  return searchBlogs(posts, query);
}
