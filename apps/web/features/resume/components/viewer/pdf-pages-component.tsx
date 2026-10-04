'use client';

import '@/lib/pdf-worker';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '../../styles/pdf-text-layer.css';

import React from 'react';
import { Document, Page } from 'react-pdf';

import { Button } from '@/components/ui/button';
import { RESUME_PDF_FILENAME, RESUME_PDF_PATH } from '@/config/resume';

import {
  useResumePreviewReady,
  useResumeViewer,
} from '../../context/resume-viewer-provider';

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
      const next = Math.round(element.clientWidth);

      setWidth((current) => {
        if (next <= 0) return current;
        if (current === 0) return next;
        if (Math.abs(current - next) < WIDTH_SNAP_PX) return current;
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
  const { src, zoom, setNumPages } = useResumeViewer();
  const { setPreviewReady } = useResumePreviewReady();

  return (
    <PdfDocument
      key={src}
      src={src}
      zoom={zoom}
      setNumPages={setNumPages}
      setPreviewReady={setPreviewReady}
    />
  );
}

function PdfDocument({
  src,
  zoom,
  setNumPages,
  setPreviewReady,
}: {
  src: string;
  zoom: number;
  setNumPages: (numPages: number) => void;
  setPreviewReady: (ready: boolean) => void;
}) {
  const sizerRef = React.useRef<HTMLDivElement>(null);
  const sizerWidth = useStableWidth(sizerRef);
  const [loadedPages, setLoadedPages] = React.useState(0);
  const [retryKey, setRetryKey] = React.useState(0);

  const fitWidth = Math.min(sizerWidth, MAX_PAGE_WIDTH_PX);
  const pageWidth = Math.max(0, Math.floor(fitWidth * zoom));

  const settleDocumentError = () => {
    setNumPages(0);
    setPreviewReady(true);
  };

  const retry = () => {
    setPreviewReady(false);
    setLoadedPages(0);
    setNumPages(0);
    setRetryKey((current) => current + 1);
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center">
      <div ref={sizerRef} className="w-full max-w-225" />

      {pageWidth > 0 ? (
        <Document
          key={`${src}:${retryKey}`}
          file={src}
          suspense={false}
          className="flex w-full flex-col items-center"
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
                  className="bg-white shadow-sm"
                  style={{ width: pageWidth, aspectRatio: ASPECT_RATIO }}
                >
                  <PdfPage
                    pageNumber={pageNumber}
                    width={pageWidth}
                    onFirstPageSettled={
                      pageNumber === 1 ? () => setPreviewReady(true) : undefined
                    }
                    onRetry={retry}
                  />
                </div>
              );
            })}
          </div>
        </Document>
      ) : null}
    </div>
  );
}

function PdfPage({
  pageNumber,
  width,
  onFirstPageSettled,
  onRetry,
}: {
  pageNumber: number;
  width: number;
  onFirstPageSettled?: () => void;
  onRetry: () => void;
}) {
  const pageRef = React.useRef<HTMLDivElement>(null);

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
      width={width}
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
