import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import { usePdfcnTheme } from '@/components/pdf/theme-provider';
import { flatten, Text } from '@/lib/pdfcn/pdf-primitives';

import { useBodyTextStyle } from '../../hooks/use-body-text-style';
import { Entry } from './entry';
import { FlushItem, FlushList } from './resume-list';

type WithChildren = { children?: ReactNode };

export function SectionHeading({ children }: WithChildren) {
  const theme = usePdfcnTheme();
  const { heading } = theme.typography;

  return (
    <h2
      style={
        flatten({
          fontFamily: heading.fontFamily,
          fontSize: heading.fontSize.h2,
          fontWeight: heading.fontWeight,
          lineHeight: heading.lineHeight,
          color: theme.colors.foreground,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          margin: 0,
          marginTop: theme.spacing.sectionGap,
          marginBottom: theme.spacing.componentGap,
          borderBottomWidth: 2.5,
          borderBottomStyle: 'solid',
          borderBottomColor: theme.colors.divider,
        }) as CSSProperties
      }
    >
      {children}
    </h2>
  );
}

function Paragraph({ children }: WithChildren) {
  const bodyStyle = useBodyTextStyle();

  return <Text style={bodyStyle}>{children}</Text>;
}

function Anchor({ href, children }: ComponentProps<'a'>) {
  const theme = usePdfcnTheme();

  return (
    <Text
      href={href}
      style={{ color: theme.colors.foreground, textDecoration: 'none' }}
    >
      {children}
    </Text>
  );
}

function Strong({ children }: WithChildren) {
  return <Text style={{ fontWeight: 700 }}>{children}</Text>;
}

function Emphasis({ children }: WithChildren) {
  return <Text style={{ fontStyle: 'italic' }}>{children}</Text>;
}

export const resumePdfComponents: MDXRemoteProps['components'] = {
  h2: SectionHeading,
  p: Paragraph,
  ul: FlushList,
  li: FlushItem,
  a: Anchor,
  strong: Strong,
  em: Emphasis,
  Entry,
};
