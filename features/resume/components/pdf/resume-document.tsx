'use no memo';
// Takumi runs these outside React's renderer, without the compiler runtime.

import type { ReactNode } from 'react';

import { usePdfcnTheme } from '@/components/pdf/theme-provider';
import { View } from '@/lib/pdfcn/pdf-primitives';
import type { ResumeMetadata } from '@/types/document';

import { ResumeHeader } from './resume-header';

type ResumeDocumentProps = {
  metadata: ResumeMetadata;
  children: ReactNode;
};

/** Root of the Takumi tree: header block followed by the compiled MDX body. */
export function ResumeDocument({ metadata, children }: ResumeDocumentProps) {
  const theme = usePdfcnTheme();

  return (
    <View
      style={{
        width: '100%',
        fontFamily: theme.typography.body.fontFamily,
        color: theme.colors.foreground,
        backgroundColor: theme.colors.background,
      }}
    >
      <ResumeHeader
        name={metadata.name}
        location={metadata.location}
        links={metadata.links}
      />
      {children}
    </View>
  );
}
