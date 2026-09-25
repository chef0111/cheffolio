import { Children, Fragment, isValidElement, type ReactNode } from 'react';

import { KeepTogether } from '@/components/pdf/keep-together/keep-together';
import {
  PdfcnThemeProvider,
  usePdfcnTheme,
} from '@/components/pdf/theme-provider';
import { View } from '@/lib/pdfcn/pdf-primitives';
import type { ResumeMetadata } from '@/types/document';

import type { SectionPlan } from '../../lib/paginate-resume';
import { resumeTheme, withBodyLineHeight } from '../../lib/pdf-theme';
import { Entry } from './entry';
import { SectionHeading } from './mdx-components';
import { ResumeHeader } from './resume-header';
import { FlushItem, FlushList } from './resume-list';

type ResumeDocumentProps = {
  metadata: ResumeMetadata;
  children: ReactNode;
  plans?: SectionPlan[];
};

const PDF_LEAVES = new Set<unknown>([
  SectionHeading,
  Entry,
  FlushList,
  FlushItem,
]);
function isSectionHeading(node: ReactNode) {
  return isValidElement(node) && node.type === SectionHeading;
}

function isEntry(node: ReactNode) {
  return isValidElement(node) && node.type === Entry;
}

/**
 * MDX compiles to a wrapper component. Invoke it and flatten fragments so
 * each `h2` is a direct sibling of the blocks that belong to it.
 */
export function flattenMdx(node: ReactNode): ReactNode[] {
  const nodes = Children.toArray(node);

  if (nodes.length === 1 && isValidElement(nodes[0])) {
    const child = nodes[0];
    const nested = (child.props as { children?: ReactNode }).children;

    if (child.type === Fragment) {
      return flattenMdx(nested ?? []);
    }

    if (typeof child.type === 'function' && !PDF_LEAVES.has(child.type)) {
      const rendered = (child.type as (props: unknown) => ReactNode)(
        child.props
      );
      return flattenMdx(rendered);
    }
  }

  return nodes.flatMap((child) => {
    if (!isValidElement(child) || child.type !== Fragment) return [child];

    return flattenMdx((child.props as { children?: ReactNode }).children ?? []);
  });
}

export function splitResumeSections(children: ReactNode): ReactNode[][] {
  const sections: ReactNode[][] = [];
  let current: ReactNode[] = [];

  for (const node of flattenMdx(children)) {
    if (isSectionHeading(node) && current.length > 0) {
      sections.push(current);
      current = [node];
    } else {
      current.push(node);
    }
  }

  if (current.length > 0) sections.push(current);

  return sections;
}

export function ResumeSection({
  nodes,
  plan,
}: {
  nodes: ReactNode[];
  plan?: SectionPlan;
}) {
  const lineHeight = plan?.lineHeight ?? resumeTheme.typography.body.lineHeight;
  const breakBefore = plan?.breakBefore ?? false;
  const keepWhole = plan?.keepWhole ?? true;
  const heading = isSectionHeading(nodes[0]) ? nodes[0] : null;
  const content = heading ? nodes.slice(1) : nodes;
  const [first, ...rest] = content;
  const bodyGap = content.some(isEntry)
    ? resumeTheme.spacing.componentGap
    : resumeTheme.spacing.paragraphGap;

  const body = (
    <View wrap={!keepWhole} style={{ gap: bodyGap }}>
      {content}
    </View>
  );

  return (
    <PdfcnThemeProvider theme={withBodyLineHeight(resumeTheme, lineHeight)}>
      <View wrap={!keepWhole} break={breakBefore} style={{ lineHeight }}>
        {!keepWhole && heading && first !== undefined ? (
          <>
            <KeepTogether>
              {heading}
              {first}
            </KeepTogether>
            {rest.length > 0 ? (
              <View style={{ gap: bodyGap, marginTop: bodyGap }}>{rest}</View>
            ) : null}
          </>
        ) : (
          <>
            {heading}
            {body}
          </>
        )}
      </View>
    </PdfcnThemeProvider>
  );
}

/** Heading plus the first following block, used to detect a stranded heading. */
export function ResumeSectionLead({ nodes }: { nodes: ReactNode[] }) {
  const [heading, first] = nodes;

  if (!isSectionHeading(heading) || first === undefined) {
    return <KeepTogether>{nodes}</KeepTogether>;
  }

  return (
    <KeepTogether>
      {heading}
      {first}
    </KeepTogether>
  );
}

export function ResumeHeaderBlock({ metadata }: { metadata: ResumeMetadata }) {
  return (
    <ResumeHeader
      name={metadata.name}
      location={metadata.location}
      links={metadata.links}
    />
  );
}

/** Root of the Takumi tree: header block followed by the compiled MDX body. */
export function ResumeDocument({
  metadata,
  children,
  plans,
}: ResumeDocumentProps) {
  const theme = usePdfcnTheme();
  const sections = splitResumeSections(children);

  return (
    <View
      style={{
        width: '100%',
        fontFamily: theme.typography.body.fontFamily,
        color: theme.colors.foreground,
        backgroundColor: theme.colors.background,
        orphans: 3,
        widows: 3,
      }}
    >
      <ResumeHeaderBlock metadata={metadata} />
      {sections.map((nodes, index) => (
        <ResumeSection key={index} nodes={nodes} plan={plans?.[index]} />
      ))}
    </View>
  );
}
