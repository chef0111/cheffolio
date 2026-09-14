'use client';

import 'pdfjs-dist/webpack.mjs';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '../../styles/pdf-text-layer.css';

import React from 'react';
import { Document, Page } from 'react-pdf';

import {
  useResumePreviewReady,
  useResumeViewer,
} from '../../context/resume-viewer-provider';

const PAGE_GAP_PX = 16;
const MAX_PAGE_WIDTH_PX = 900;
const WIDTH_SNAP_PX = 4;
const A4_ASPECT = '210 / 297';

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

  const fitWidth = Math.min(sizerWidth, MAX_PAGE_WIDTH_PX);
  const pageWidth = Math.max(0, Math.floor(fitWidth * zoom));

  return (
    <div className="flex min-h-full w-full flex-col items-center">
      <div ref={sizerRef} className="w-full max-w-225" />

      {pageWidth > 0 ? (
        <Document
          file={src}
          className="flex w-full flex-col items-center"
          loading={null}
          error={
            <p className="text-muted-foreground py-8 text-center text-sm">
              The PDF could not be loaded.
            </p>
          }
          externalLinkTarget="_blank"
          externalLinkRel="noopener noreferrer"
          onLoadSuccess={(pdf) => {
            setLoadedPages(pdf.numPages);
            setNumPages(pdf.numPages);
          }}
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
                  style={{ width: pageWidth, aspectRatio: A4_ASPECT }}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth}
                    loading={null}
                    onRenderSuccess={
                      pageNumber === 1 ? () => setPreviewReady(true) : undefined
                    }
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
