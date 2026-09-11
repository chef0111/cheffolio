import { format } from 'date-fns';

import { SITE_INFO } from '@/config/site';
import { getBlogPosts } from '@/lib/document';

const allPosts = getBlogPosts()
  .slice()
  .sort(
    (a, b) =>
      new Date(b.metadata.createdAt).getTime() -
      new Date(a.metadata.createdAt).getTime()
  );

const content = `# Blog

> Ideas, experiments, and insights from my journey as a developer.

Each link below returns the full post as Markdown. Drop the \`.md\` extension for the web page.

## All posts (${allPosts.length})

${allPosts.map((item) => `- [${item.metadata.title}](${SITE_INFO.url}/blog/${item.slug}.md) (${format(new Date(item.metadata.createdAt), 'yyyy-MM-dd')}): ${item.metadata.description}`).join('\n')}
`;

export async function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  });
}
