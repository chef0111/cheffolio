'use client';

import React from 'react';

const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

/** Zoom is relative to fit-width, so `1` always means "page fills the viewport". */
export type ResumeViewerState = {
  src: string;
  numPages: number;
  zoom: number;
};

export type ResumeViewerActions = {
  setNumPages: (numPages: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitWidth: () => void;
};

export type ResumeViewerContextValue = ResumeViewerState & ResumeViewerActions;

const ResumeViewerContext =
  React.createContext<ResumeViewerContextValue | null>(null);

const PreviewReadyContext = React.createContext<{
  isPreviewReady: boolean;
  setPreviewReady: (ready: boolean) => void;
} | null>(null);

export function useResumeViewer() {
  const context = React.use(ResumeViewerContext);

  if (!context) {
    throw new Error(
      'ResumeViewer parts must be rendered inside <ResumeViewer>'
    );
  }

  return context;
}

export function useResumePreviewReady() {
  const context = React.use(PreviewReadyContext);

  if (!context) {
    throw new Error(
      'ResumeViewer parts must be rendered inside <ResumeViewer>'
    );
  }

  return context;
}

function clampZoom(zoom: number) {
  const snapped = Math.round(zoom / ZOOM_STEP) * ZOOM_STEP;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, snapped));
}

export function ResumeViewerProvider({
  src,
  children,
}: {
  src: string;
  children: React.ReactNode;
}) {
  const [numPages, setNumPages] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [previewSrc, setPreviewSrc] = React.useState(src);
  const [isPreviewReady, setPreviewReady] = React.useState(false);

  if (previewSrc !== src) {
    setPreviewSrc(src);
    setPreviewReady(false);
    setNumPages(0);
  }

  const zoomIn = React.useCallback(() => {
    setZoom((current) => clampZoom(current + ZOOM_STEP));
  }, []);

  const zoomOut = React.useCallback(() => {
    setZoom((current) => clampZoom(current - ZOOM_STEP));
  }, []);

  const fitWidth = React.useCallback(() => {
    setZoom(1);
  }, []);

  const value = React.useMemo<ResumeViewerContextValue>(
    () => ({
      src,
      numPages,
      zoom,
      setNumPages,
      zoomIn,
      zoomOut,
      fitWidth,
    }),
    [src, numPages, zoom, zoomIn, zoomOut, fitWidth]
  );

  const preview = React.useMemo(
    () => ({ isPreviewReady, setPreviewReady }),
    [isPreviewReady]
  );

  return (
    <ResumeViewerContext value={value}>
      <PreviewReadyContext value={preview}>{children}</PreviewReadyContext>
    </ResumeViewerContext>
  );
}
