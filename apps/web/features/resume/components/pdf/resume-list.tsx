import { Children, isValidElement, type ReactNode } from 'react';

import { usePdfcnTheme } from '@/components/pdf/theme-provider';
import { Text, View } from '@/lib/pdfcn/pdf-primitives';

import { useBodyTextStyle } from '../../hooks/use-body-text-style';

type WithChildren = { children?: ReactNode };

/** Plain list row with no marker. Used for sections like Technical Skills. */
export function FlushItem({ children }: WithChildren) {
  const bodyStyle = useBodyTextStyle();

  return (
    <View>
      <Text style={bodyStyle}>{children}</Text>
    </View>
  );
}

/**
 * Single bullet row. Matches pdfcn List bullet layout: marker in a fixed-width
 * column, text in a flex:1 View (never flex on Text — Yoga under-measures).
 */
function BulletItem({ children }: WithChildren) {
  const bodyStyle = useBodyTextStyle();
  const theme = usePdfcnTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: 8,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: 3,
          width: 14,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.foreground,
            borderRadius: 2.5,
            height: 4,
            width: 4,
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={bodyStyle}>{children}</Text>
      </View>
    </View>
  );
}

/** Unordered list container for MDX `ul` (no markers). */
export function FlushList({ children }: WithChildren) {
  return (
    <View style={{ flexDirection: 'column', gap: 1, paddingBottom: 4 }}>
      {Children.toArray(children)}
    </View>
  );
}

function listItems(children: ReactNode) {
  return Children.toArray(children).flatMap((child) => {
    if (isValidElement(child) && child.type === FlushList) {
      return Children.toArray((child.props as WithChildren).children);
    }

    return [child];
  });
}

/** Bullet list used inside Entry. Converts FlushItem rows to BulletItem. */
export function BulletList({ children }: WithChildren) {
  return (
    <View style={{ flexDirection: 'column', gap: 1, paddingBottom: 4 }}>
      {listItems(children).map((child, index) => {
        if (isValidElement(child) && child.type === FlushItem) {
          return (
            <BulletItem key={index}>
              {(child.props as WithChildren).children}
            </BulletItem>
          );
        }

        return child;
      })}
    </View>
  );
}
