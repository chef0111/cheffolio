'use no memo';
// Takumi runs these outside React's renderer, without the compiler runtime.

import type { ReactNode } from 'react';

import type { Style } from '@/components/pdf/types';
import { View } from '@/lib/pdfcn/pdf-primitives';

export interface KeepTogetherProps {
  children?: ReactNode;
  minPresenceAhead?: number;
  style?: Style;
}

export const KeepTogether = ({ children, style }: KeepTogetherProps) => (
  <View style={[{ breakInside: 'avoid' }, style].filter(Boolean) as never}>
    {children}
  </View>
);
