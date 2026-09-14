import { Children, Fragment, isValidElement, type ReactNode } from 'react';

import { KeepTogether } from '@/components/pdf/keep-together/keep-together';
import { usePdfcnTheme } from '@/components/pdf/theme-provider';
import { Text, View } from '@/lib/pdfcn/pdf-primitives';

import { ExternalLinkPdfIcon } from './icons';
import { BulletList, FlushList } from './resume-list';

type WithChildren = { children?: ReactNode };

export type EntryProps = {
  title: string;
  subtitle?: string;
  date?: string;
  href?: string;
  location?: string;
  children?: ReactNode;
};

function withEntryLists(node: ReactNode): ReactNode {
  if (!isValidElement(node)) return node;

  if (node.type === Fragment) {
    return Children.map((node.props as WithChildren).children, withEntryLists);
  }

  if (node.type === FlushList) {
    return <BulletList>{node}</BulletList>;
  }

  return node;
}

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
    color: theme.colors.foreground,
    textDecoration: 'none',
  };

  const metaStyle = {
    fontSize: body.fontSize,
    color: theme.colors.foreground,
  };

  const hasSecondRow = Boolean(subtitle || location);

  return (
    <KeepTogether>
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
          {href && <ExternalLinkPdfIcon size={7} />}
        </View>
        {date && (
          <Text style={{ ...metaStyle, color: theme.colors.mutedForeground }}>
            {date}
          </Text>
        )}
      </View>

      {hasSecondRow && (
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
          {location && (
            <Text style={{ ...metaStyle, color: theme.colors.mutedForeground }}>
              {location}
            </Text>
          )}
        </View>
      )}

      {Children.map(children, withEntryLists)}
    </KeepTogether>
  );
}
