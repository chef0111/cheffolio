import type { PhrasingContent, Root } from 'mdast';
import { visit } from 'unist-util-visit';

import type { ResumeEntryMetadata } from '@/lib/parse-resume-entries';

type Output = 'pdf' | 'markdown';

export function remarkResumeEntry(
  entries: ResumeEntryMetadata[],
  output: Output
) {
  return () => (tree: Root) => {
    let index = 0;

    visit(tree, 'heading', (heading) => {
      if (heading.depth !== 3) return;

      const entry = entries[index++];

      if (!entry) throw new Error('Resume heading has no metadata block');

      if (output === 'pdf') {
        heading.data = {
          ...heading.data,
          hProperties: {
            'data-resume-title': entry.title,
            'data-resume-subtitle': entry.subtitle,
            'data-resume-date': entry.date,
            'data-resume-href': entry.href,
            'data-resume-location': entry.location,
          },
        };
        return;
      }

      const title: PhrasingContent = entry.href
        ? {
            type: 'link',
            url: entry.href,
            children: [{ type: 'text', value: entry.title }],
          }
        : { type: 'text', value: entry.title };
      const tail = [
        entry.subtitle ? ` | ${entry.subtitle}` : '',
        entry.location ? ` | ${entry.location}` : '',
        entry.date ? ` (${entry.date})` : '',
      ].join('');

      heading.children = tail
        ? [title, { type: 'text', value: tail }]
        : [title];
    });

    if (index !== entries.length) {
      throw new Error('Resume metadata block has no heading');
    }
  };
}
