import { Children, isValidElement, type ReactNode } from 'react';

import { Text, View } from '@/lib/pdfcn/pdf-primitives';

import { useBodyTextStyle } from '../../hooks/use-body-text-style';

type WithChildren = { children?: ReactNode };

export function FlushItem({ children }: WithChildren) {
  const bodyStyle = useBodyTextStyle();

  return (
    <View>
      <Text style={bodyStyle}>{children}</Text>
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

export function FlushList({ children }: WithChildren) {
  return <View style={{ gap: 1, paddingBottom: 4 }}>{children}</View>;
}

function listItems(children: ReactNode) {
  return Children.toArray(children).flatMap((child) => {
    if (isValidElement(child) && child.type === FlushList) {
      return Children.toArray((child.props as WithChildren).children);
    }

    return [child];
  });
}

export function BulletList({ children }: WithChildren) {
  return (
    <View style={{ gap: 1, paddingBottom: 4 }}>
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
