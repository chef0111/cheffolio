import { format } from 'date-fns';

import type { Blog } from '../types/blog';

export function getMarkdownText(blog: Blog) {
  return `# ${blog.metadata.title}

${blog.metadata.description}

${blog.content}

Last updated on ${format(new Date(blog.metadata.updatedAt), 'MMMM d, yyyy')}`;
}
