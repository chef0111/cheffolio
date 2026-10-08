'use client';

import '@/lib/pdf-worker';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '../styles/pdf-text-layer.css';

import React from 'react';
import { Document, Page } from 'react-pdf';

import { Button } from '@/components/ui/button';
import { RESUME_PDF_FILENAME, RESUME_PDF_PATH } from '@/config/resume';

import {
  useResumePreviewReady,
  useResumeViewer,
  useResumeViewerDocument,
} from '../context/resume-viewer-provider';

const PAGE_GAP_PX = 16;
const MAX_PAGE_WIDTH_PX = 900;
const WIDTH_SNAP_PX = 4;
const ASPECT_RATIO = '210 / 297'; // A4 paper size

function getAnnotationLabel(href: string) {
  try {
    const url = new URL(href);
    return `Open link to ${url.hostname}`;
  } catch {
    return 'Open PDF link';
  }
}

function useStableWidth(elementRef: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const read = () => {
      const next = Math.floor(element.getBoundingClientRect().width);

      setWidth((current) => {
        if (next <= 0) return current;
        if (current === 0) return next;
        if (next >= current && next - current < WIDTH_SNAP_PX) return current;
        return next;
      });
    };

    read();

    const observer = new ResizeObserver(read);
    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef]);

  return width;
}

export function PdfPages() {
  const { src, setNumPages } = useResumeViewerDocument();
  const { setPreviewReady } = useResumePreviewReady();

  return (
    <PdfPagesLayout>
      <PdfDocument
        key={src}
        src={src}
        setNumPages={setNumPages}
        setPreviewReady={setPreviewReady}
      />
    </PdfPagesLayout>
  );
}

function PdfPagesLayout({ children }: { children: React.ReactNode }) {
  const { zoom } = useResumeViewer();
  const sizerRef = React.useRef<HTMLDivElement>(null);
  const sizerWidth = useStableWidth(sizerRef);
  const fitWidth = Math.min(sizerWidth, MAX_PAGE_WIDTH_PX);
  const pageWidth = Math.max(0, Math.floor(fitWidth * zoom));

  return (
    <div
      className="flex min-h-full w-full flex-col items-center"
      style={
        {
          '--resume-page-width': `${pageWidth}px`,
          '--resume-page-scale': pageWidth / MAX_PAGE_WIDTH_PX,
        } as React.CSSProperties
      }
    >
      <div ref={sizerRef} className="w-full max-w-225" />
      {pageWidth > 0 ? children : null}
    </div>
  );
}

function PdfDocument({
  src,
  setNumPages,
  setPreviewReady,
}: {
  src: string;
  setNumPages: (numPages: number) => void;
  setPreviewReady: (ready: boolean) => void;
}) {
  const [loadedPages, setLoadedPages] = React.useState(0);
  const [retryKey, setRetryKey] = React.useState(0);

  const settleDocumentError = React.useCallback(() => {
    setNumPages(0);
    setPreviewReady(true);
  }, [setNumPages, setPreviewReady]);

  const retry = React.useCallback(() => {
    setPreviewReady(false);
    setLoadedPages(0);
    setNumPages(0);
    setRetryKey((current) => current + 1);
  }, [setNumPages, setPreviewReady]);

  const settleFirstPage = React.useCallback(() => {
    setPreviewReady(true);
  }, [setPreviewReady]);

  return (
    <Document
      key={`${src}:${retryKey}`}
      file={src}
      suspense={false}
      className="flex w-full flex-col items-center-safe"
      loading={null}
      error={<ResumeViewerError onRetry={retry} />}
      externalLinkTarget="_blank"
      externalLinkRel="noopener noreferrer"
      onLoadSuccess={(pdf) => {
        setLoadedPages(pdf.numPages);
        setNumPages(pdf.numPages);
      }}
      onLoadError={settleDocumentError}
      onSourceError={settleDocumentError}
    >
      <div
        data-slot="resume-viewer-pages"
        className="flex flex-col items-center"
        style={{ gap: PAGE_GAP_PX }}
      >
        {Array.from({ length: loadedPages }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <div
              key={pageNumber}
              data-slot="resume-viewer-page"
              data-page-number={pageNumber}
              className="relative overflow-hidden bg-white shadow-sm"
              style={{
                width: 'var(--resume-page-width)',
                aspectRatio: ASPECT_RATIO,
              }}
            >
              <div
                className="absolute top-0 left-0 origin-top-left"
                style={{
                  width: MAX_PAGE_WIDTH_PX,
                  transform: 'scale(var(--resume-page-scale))',
                }}
              >
                <PdfPage
                  pageNumber={pageNumber}
                  onFirstPageSettled={
                    pageNumber === 1 ? settleFirstPage : undefined
                  }
                  onRetry={retry}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Document>
  );
}

function PdfPage({
  pageNumber,
  onFirstPageSettled,
  onRetry,
}: {
  pageNumber: number;
  onFirstPageSettled?: () => void;
  onRetry: () => void;
}) {
  const pageRef = React.useRef<HTMLDivElement>(null);
  // Keep raster density stable during zoom while retaining detail when enlarged.
  const [devicePixelRatio] = React.useState(() =>
    Math.max(2, window.devicePixelRatio)
  );

  const nameAnnotationLinks = () => {
    pageRef.current
      ?.querySelectorAll<HTMLAnchorElement>('a[href]')
      .forEach((link) => {
        if (link.textContent?.trim() || link.getAttribute('aria-label')) return;
        link.setAttribute('aria-label', getAnnotationLabel(link.href));
      });
  };

  return (
    <Page
      pageNumber={pageNumber}
      width={MAX_PAGE_WIDTH_PX}
      devicePixelRatio={devicePixelRatio}
      suspense={false}
      inputRef={pageRef}
      loading={null}
      error={<ResumeViewerError onRetry={onRetry} compact />}
      onRenderSuccess={onFirstPageSettled}
      onRenderError={onFirstPageSettled}
      onLoadError={onFirstPageSettled}
      onRenderAnnotationLayerSuccess={nameAnnotationLinks}
    />
  );
}

function ResumeViewerError({
  onRetry,
  compact = false,
}: {
  onRetry: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 px-4 py-8 text-center"
      role="alert"
    >
      <p className="text-muted-foreground text-sm">
        {compact
          ? 'This PDF page could not be rendered.'
          : 'The Resume PDF could not be loaded.'}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href={RESUME_PDF_PATH} download={RESUME_PDF_FILENAME} />}
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
}
