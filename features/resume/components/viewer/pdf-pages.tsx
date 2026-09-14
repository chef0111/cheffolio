'use client';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { useResumeViewer } from './resume-viewer-context';
import { ResumeViewerPlaceholder } from './resume-viewer-placeholder';

// react-pdf requires the worker to be configured in the module that renders <Document>.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PAGE_GAP_PX = 16;
const MAX_PAGE_WIDTH_PX = 900;
const VISIBILITY_THRESHOLDS = [0.25, 0.5, 0.75, 1];

function useViewportWidth(viewportRef: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    observer.observe(viewport);

    return () => observer.disconnect();
  }, [viewportRef]);

  return width;
}

/** Reports the page with the largest visible area as the current page. */
function useCurrentPageTracking(
  viewportRef: React.RefObject<HTMLDivElement | null>,
  numPages: number,
  setCurrentPage: (page: number) => void
) {
  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || numPages === 0) return;

    const ratios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const page = Number((entry.target as HTMLElement).dataset.pageNumber);
          ratios.set(page, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestPage = 0;
        let bestRatio = 0;
        for (const [page, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestPage = page;
            bestRatio = ratio;
          }
        }

        if (bestPage > 0) setCurrentPage(bestPage);
      },
      { root: viewport, threshold: VISIBILITY_THRESHOLDS }
    );

    const pages = viewport.querySelectorAll<HTMLElement>(
      '[data-slot="resume-viewer-page"]'
    );
    pages.forEach((page) => observer.observe(page));

    return () => observer.disconnect();
  }, [viewportRef, numPages, setCurrentPage]);
}

export function PdfPages() {
  const { src, numPages, zoom, viewportRef, setNumPages, setCurrentPage } =
    useResumeViewer();

  const viewportWidth = useViewportWidth(viewportRef);
  useCurrentPageTracking(viewportRef, numPages, setCurrentPage);

  const fitWidth = Math.min(viewportWidth, MAX_PAGE_WIDTH_PX);
  const pageWidth = Math.max(0, Math.floor(fitWidth * zoom));

  if (viewportWidth === 0) return <ResumeViewerPlaceholder />;

  return (
    <Document
      file={src}
      className="flex flex-col items-center"
      loading={<ResumeViewerPlaceholder />}
      error={
        <p className="text-muted-foreground py-8 text-center text-sm">
          The PDF could not be loaded.
        </p>
      }
      externalLinkTarget="_blank"
      externalLinkRel="noopener noreferrer"
      onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
    >
      <div
        data-slot="resume-viewer-pages"
        className="flex flex-col items-center"
        style={{ gap: PAGE_GAP_PX }}
      >
        {Array.from({ length: numPages }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <div
              key={pageNumber}
              data-slot="resume-viewer-page"
              data-page-number={pageNumber}
              className="bg-white shadow-sm"
            >
              <Page pageNumber={pageNumber} width={pageWidth} loading={null} />
            </div>
          );
        })}
      </div>
    </Document>
  );
}
