'use no memo';
// Takumi runs these outside React's renderer, without the compiler runtime.

import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import { usePdfcnTheme } from '@/components/pdf/theme-provider';
import { flatten, Text, View } from '@/lib/pdfcn/pdf-primitives';

import { Entry } from './entry';

type WithChildren = { children?: ReactNode };

function useBodyTextStyle() {
  const theme = usePdfcnTheme();
  const { body } = theme.typography;

  return {
    fontFamily: body.fontFamily,
    fontSize: body.fontSize,
    lineHeight: body.lineHeight,
    color: theme.colors.foreground,
  };
}

/** Uppercase section title with a rule underneath. A real `h2` so the PDF outline picks it up. */
function SectionHeading({ children }: WithChildren) {
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
          paddingBottom: 1.5,
          borderBottomWidth: 0.75,
          borderBottomStyle: 'solid',
          borderBottomColor: theme.colors.border,
        }) as CSSProperties
      }
    >
      {children}
    </h2>
  );
}

function Paragraph({ children }: WithChildren) {
  const theme = usePdfcnTheme();
  const bodyStyle = useBodyTextStyle();

  return (
    <Text style={{ ...bodyStyle, marginBottom: theme.spacing.paragraphGap }}>
      {children}
    </Text>
  );
}

function BulletList({ children }: WithChildren) {
  const theme = usePdfcnTheme();

  return (
    <View style={{ gap: 1, marginBottom: theme.spacing.paragraphGap }}>
      {children}
    </View>
  );
}

function BulletItem({ children }: WithChildren) {
  const bodyStyle = useBodyTextStyle();

  return (
    <View style={{ flexDirection: 'row', gap: 5, paddingLeft: 8 }}>
      <Text style={bodyStyle}>•</Text>
      <View style={{ flex: 1 }}>
        <Text style={bodyStyle}>{children}</Text>
      </View>
    </View>
  );
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
  ul: BulletList,
  li: BulletItem,
  a: Anchor,
  strong: Strong,
  em: Emphasis,
  Entry,
};
