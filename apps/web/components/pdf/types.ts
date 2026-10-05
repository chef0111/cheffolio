import type { ReactNode } from 'react';

import type { Style } from '@/lib/pdfcn/pdf-primitives';

export type { Style };

/** Props shared by every pdfcn component: children plus a style override. */
export interface PDFComponentProps {
  children?: ReactNode;
  style?: Style | Style[];
}
