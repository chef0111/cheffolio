import 'server-only';

import { cacheLife } from 'next/cache';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { render } from 'takumi-pdf/next';

import { PdfcnThemeProvider } from '@/components/pdf/theme-provider';
import { pointToCssPixel } from '@/lib/pdfcn/pdf-primitives';
import type { ResumeDoc } from '@/types/document';

import { resumePdfComponents } from '../components/pdf/mdx-components';
import { ResumeDocument } from '../components/pdf/resume-document';
import { RESUME_FONT_FAMILY } from './constants';
import { resumeFonts } from './pdf-fonts';
import { resumeTheme } from './pdf-theme';

const { page } = resumeTheme.spacing;

const PAGE_MARGIN = {
  top: pointToCssPixel(page.marginTop),
  right: pointToCssPixel(page.marginRight),
  bottom: pointToCssPixel(page.marginBottom),
  left: pointToCssPixel(page.marginLeft),
};

/**
 * Compiles the Resume source with the PDF component map and renders it to
 * A4 bytes with Takumi. Cached for the lifetime of the build.
 */
export async function renderResumePdf(doc: ResumeDoc): Promise<Uint8Array> {
  'use cache';
  cacheLife('max');

  const { content } = await compileMDX({
    source: doc.content,
    components: resumePdfComponents,
    options: {
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  return render(
    <PdfcnThemeProvider theme={resumeTheme}>
      <ResumeDocument metadata={doc.metadata}>{content}</ResumeDocument>
    </PdfcnThemeProvider>,
    {
      size: 'a4',
      margin: PAGE_MARGIN,
      fonts: resumeFonts,
      fontFamilies: [RESUME_FONT_FAMILY, 'serif'],
      lang: 'en',
      outline: true,
      metadata: {
        title: `${doc.metadata.name} - ${doc.metadata.title}`,
        authors: [doc.metadata.name],
      },
    }
  );
}
