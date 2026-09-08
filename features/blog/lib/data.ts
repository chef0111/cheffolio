import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { cache } from 'react';

import type { Blog, BlogMetadata } from '../types/blog';

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent);

  return {
    metadata: file.data as BlogMetadata,
    content: file.content,
  };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string): Blog[] {
  return getMDXFiles(dir).map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));

    return {
      metadata,
      slug: path.basename(file, path.extname(file)),
      content,
    };
  });
}

export const getAllBlogs = cache(() => {
  return getMDXData(path.join(process.cwd(), 'features/blog/content')).sort(
    (a, b) => {
      if (a.metadata.pinned && !b.metadata.pinned) return -1;
      if (!a.metadata.pinned && b.metadata.pinned) return 1;

      return (
        new Date(b.metadata.createdAt).getTime() -
        new Date(a.metadata.createdAt).getTime()
      );
    }
  );
});

export function getBlogBySlug(slug: string) {
  return getAllBlogs().find((blog) => blog.slug === slug);
}

export function findNeighbour(blogs: Blog[], slug: string) {
  const len = blogs.length;

  for (let i = 0; i < len; ++i) {
    if (blogs[i].slug === slug) {
      return {
        previous: i > 0 ? blogs[i - 1] : null,
        next: i < len - 1 ? blogs[i + 1] : null,
      };
    }
  }

  return { previous: null, next: null };
}
