import { format } from 'date-fns';
import { remarkHeading } from 'fumadocs-core/mdx-plugins/remark-heading';
import { cacheLife } from 'next/cache';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';

import { RESUME_CATEGORY } from '@/lib/document';
import { remarkFlattenEntry } from '@/lib/remark-flatten-entry';
import type { Doc, ResumeDoc } from '@/types/document';

const processor = remark().use(remarkMdx).use(remarkGfm).use(remarkHeading);

const resumeProcessor = remark()
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkFlattenEntry)
  .use(remarkHeading);

function isResumeDoc(doc: Doc): doc is ResumeDoc {
  return doc.metadata.category === RESUME_CATEGORY;
}

function resumeHeader({ metadata }: ResumeDoc) {
  const { name, location, links } = metadata;

  const contact = [
    location,
    `[${links.website.replace(/^https?:\/\//, '')}](${links.website})`,
    `[GitHub](${links.github})`,
    `[LinkedIn](${links.linkedin})`,
  ].join(' | ');

  return `# ${name}\n\n${contact}`;
}

export async function processMdxForLLMs(doc: Doc) {
  'use cache';
  cacheLife('max');

  const resume = isResumeDoc(doc);

  const processed = await (resume ? resumeProcessor : processor).process({
    value: doc.content,
  });

  const header = resume ? resumeHeader(doc) : `# ${doc.metadata.title}`;

  return `${header}

${doc.metadata.description}

${processed.value}

Last updated on ${format(new Date(doc.metadata.updatedAt), 'MMMM d, yyyy')}`;
}
