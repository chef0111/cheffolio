import { defaultPrimitives } from '@/components/pdf/primitives';
import type { PdfcnTheme } from '@/components/pdf/theme-types';

import { RESUME_FONT_FAMILY } from './constants';

/**
 * Tight, monochrome tokens that mimic a LaTeX resume: Latin Modern
 * everywhere, black rules, and small vertical gaps. All lengths are points;
 * the pdfcn primitives convert them to CSS px for Takumi.
 */
export const resumeTheme: PdfcnTheme = {
  name: 'resume',
  primitives: defaultPrimitives,
  colors: {
    foreground: '#000000',
    background: '#ffffff',
    muted: '#f4f4f5',
    mutedForeground: '#3f3f46',
    primary: '#000000',
    primaryForeground: '#ffffff',
    border: '#000000',
    accent: '#000000',
    destructive: '#dc2626',
    success: '#16a34a',
    warning: '#d97706',
    info: '#0ea5e9',
  },
  typography: {
    body: {
      fontFamily: RESUME_FONT_FAMILY,
      fontSize: 10.5,
      lineHeight: 1.3,
    },
    heading: {
      fontFamily: RESUME_FONT_FAMILY,
      fontWeight: 700,
      lineHeight: 1.2,
      fontSize: {
        h1: 24,
        h2: 12,
        h3: 11,
        h4: 10.5,
        h5: 10.5,
        h6: 10.5,
      },
    },
  },
  spacing: {
    page: {
      marginTop: 36,
      marginRight: 40,
      marginBottom: 36,
      marginLeft: 40,
    },
    sectionGap: 10,
    paragraphGap: 3,
    componentGap: 6,
  },
  page: {
    size: 'A4',
    orientation: 'portrait',
  },
};
