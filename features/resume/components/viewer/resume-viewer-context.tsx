'use client';

import React from 'react';

const ZOOM_STEP = 1.25;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

/** Zoom is relative to fit-width, so `1` always means "page fills the viewport". */
export type ResumeViewerState = {
  src: string;
  numPages: number;
  currentPage: number;
  zoom: number;
};

export type ResumeViewerActions = {
  setNumPages: (numPages: number) => void;
  setCurrentPage: (page: number) => void;
  goToPage: (page: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitWidth: () => void;
};

export type ResumeViewerContextValue = ResumeViewerState &
  ResumeViewerActions & {
    /** Scroll container that owns the pages; parts use it for scrolling and sizing. */
    viewportRef: React.RefObject<HTMLDivElement | null>;
  };

const ResumeViewerContext =
  React.createContext<ResumeViewerContextValue | null>(null);

export function useResumeViewer() {
  const context = React.use(ResumeViewerContext);

  if (!context) {
    throw new Error(
      'ResumeViewer parts must be rendered inside <ResumeViewer>'
    );
  }

  return context;
}

function clampZoom(zoom: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function ResumeViewerProvider({
  src,
  children,
}: {
  src: string;
  children: React.ReactNode;
}) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [zoom, setZoom] = React.useState(1);

  const goToPage = React.useCallback((page: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const target = viewport.querySelector<HTMLElement>(
      `[data-slot="resume-viewer-page"][data-page-number="${page}"]`
    );

    target?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, []);

  const zoomIn = React.useCallback(() => {
    setZoom((current) => clampZoom(current * ZOOM_STEP));
  }, []);

  const zoomOut = React.useCallback(() => {
    setZoom((current) => clampZoom(current / ZOOM_STEP));
  }, []);

  const fitWidth = React.useCallback(() => {
    setZoom(1);
  }, []);

  const value = React.useMemo<ResumeViewerContextValue>(
    () => ({
      src,
      numPages,
      currentPage,
      zoom,
      viewportRef,
      setNumPages,
      setCurrentPage,
      goToPage,
      zoomIn,
      zoomOut,
      fitWidth,
    }),
    [src, numPages, currentPage, zoom, goToPage, zoomIn, zoomOut, fitWidth]
  );

  return <ResumeViewerContext value={value}>{children}</ResumeViewerContext>;
}
