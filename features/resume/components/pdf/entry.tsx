'use no memo';
// Takumi runs these outside React's renderer, without the compiler runtime.

import type { ReactNode } from 'react';

import { KeepTogether } from '@/components/pdf/keep-together/keep-together';
import { usePdfcnTheme } from '@/components/pdf/theme-provider';
import { Text, View } from '@/lib/pdfcn/pdf-primitives';

import { ExternalLinkPdfIcon } from './icons';

export type EntryProps = {
  title: string;
  subtitle?: string;
  date?: string;
  href?: string;
  location?: string;
  children?: ReactNode;
};

/**
 * A dated resume item: title and date on the first row, subtitle and
 * location on the second, then the bullet list. Kept on one page.
 */
export function Entry({
  title,
  subtitle,
  date,
  href,
  location,
  children,
}: EntryProps) {
  const theme = usePdfcnTheme();
  const { body, heading } = theme.typography;

  const titleStyle = {
    fontFamily: heading.fontFamily,
    fontSize: heading.fontSize.h3,
    fontWeight: heading.fontWeight,
    lineHeight: body.lineHeight,
    color: theme.colors.foreground,
    textDecoration: 'none',
  };

  const metaStyle = {
    fontSize: body.fontSize,
    lineHeight: body.lineHeight,
    color: theme.colors.foreground,
  };

  const hasSecondRow = Boolean(subtitle || location);

  return (
    <KeepTogether style={{ marginBottom: theme.spacing.componentGap }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Text style={titleStyle} href={href}>
            {title}
          </Text>
          {href ? <ExternalLinkPdfIcon size={7} /> : null}
        </View>
        {date ? <Text style={metaStyle}>{date}</Text> : null}
      </View>

      {hasSecondRow ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          <Text style={{ ...metaStyle, fontStyle: 'italic' }}>
            {subtitle ?? ''}
          </Text>
          {location ? (
            <Text style={{ ...metaStyle, fontStyle: 'italic' }}>
              {location}
            </Text>
          ) : null}
        </View>
      ) : null}

      {children}
    </KeepTogether>
  );
}
