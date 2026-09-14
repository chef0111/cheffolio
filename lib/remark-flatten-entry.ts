import type { Heading, PhrasingContent, Root, RootContent } from 'mdast';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import { visit } from 'unist-util-visit';

const ENTRY_NAME = 'Entry';

type EntryAttributes = {
  title?: string;
  subtitle?: string;
  date?: string;
  href?: string;
};

function readAttributes(node: MdxJsxFlowElement): EntryAttributes {
  const attributes: EntryAttributes = {};

  for (const attribute of node.attributes) {
    if (attribute.type !== 'mdxJsxAttribute') continue;
    if (typeof attribute.value !== 'string') continue;
    if (!isEntryAttribute(attribute.name)) continue;

    attributes[attribute.name] = attribute.value;
  }

  return attributes;
}

function isEntryAttribute(name: string): name is keyof EntryAttributes {
  return (
    name === 'title' ||
    name === 'subtitle' ||
    name === 'date' ||
    name === 'href'
  );
}

function buildHeading({
  title = '',
  subtitle,
  date,
  href,
}: EntryAttributes): Heading {
  const titleNode: PhrasingContent = href
    ? { type: 'link', url: href, children: [{ type: 'text', value: title }] }
    : { type: 'text', value: title };

  const tail = [subtitle ? ` | ${subtitle}` : '', date ? ` (${date})` : '']
    .join('')
    .trimEnd();

  const children: PhrasingContent[] = tail
    ? [titleNode, { type: 'text', value: tail }]
    : [titleNode];

  return { type: 'heading', depth: 3, children };
}

/**
 * Replaces each `<Entry ...>` JSX block with a level-3 heading built from its
 * attributes followed by its children, so the Markdown mirror carries no MDX.
 */
export function remarkFlattenEntry() {
  return (tree: Root) => {
    visit(tree, 'mdxJsxFlowElement', (node, index, parent) => {
      if (node.name !== ENTRY_NAME || !parent || index === undefined) return;

      const replacement: RootContent[] = [
        buildHeading(readAttributes(node)),
        ...(node.children as RootContent[]),
      ];

      parent.children.splice(index, 1, ...replacement);

      return index + replacement.length;
    });
  };
}
