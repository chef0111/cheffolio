import { format } from 'date-fns';
import { remarkHeading } from 'fumadocs-core/mdx-plugins/remark-heading';
import { cacheLife } from 'next/cache';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';

import { RESUME_CATEGORY } from '@/lib/document';
import { parseResumeEntries } from '@/lib/parse-resume-entries';
import { remarkResumeEntry } from '@/lib/remark-resume-entry';
import type { Doc, ResumeDoc } from '@/types/document';

const processor = remark().use(remarkMdx).use(remarkGfm).use(remarkHeading);

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
  const { content, entries } = resume
    ? parseResumeEntries(doc.content)
    : { content: doc.content, entries: [] };
  const mdxProcessor = resume
    ? remark()
        .use(remarkMdx)
        .use(remarkGfm)
        .use(remarkResumeEntry(entries, 'markdown'))
        .use(remarkHeading)
    : processor;
  const processed = await mdxProcessor.process({ value: content });

  const header = resume ? resumeHeader(doc) : `# ${doc.metadata.title}`;

  return `${header}

${doc.metadata.description}

${processed.value}

Last updated on ${format(new Date(doc.metadata.updatedAt), 'MMMM d, yyyy')}`;
}
