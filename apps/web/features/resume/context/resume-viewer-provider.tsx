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

export type ResumeViewerMeta = {
  viewportRef: React.RefObject<HTMLDivElement | null>;
};

export type ResumeViewerContextValue = ResumeViewerState &
  ResumeViewerActions &
  ResumeViewerMeta;

const ResumeViewerContext =
  React.createContext<ResumeViewerContextValue | null>(null);

const ResumeViewerDocumentContext = React.createContext<Pick<
  ResumeViewerContextValue,
  'src' | 'setNumPages'
> | null>(null);

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

export function useResumeViewerDocument() {
  const context = React.use(ResumeViewerDocumentContext);

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
  const viewportRef = React.useRef<HTMLDivElement>(null);

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
      viewportRef,
    }),
    [src, numPages, zoom, zoomIn, zoomOut, fitWidth, viewportRef]
  );

  const preview = React.useMemo(
    () => ({ isPreviewReady, setPreviewReady }),
    [isPreviewReady]
  );

  const document = React.useMemo(() => ({ src, setNumPages }), [src]);

  return (
    <ResumeViewerContext value={value}>
      <ResumeViewerDocumentContext value={document}>
        <PreviewReadyContext value={preview}>{children}</PreviewReadyContext>
      </ResumeViewerDocumentContext>
    </ResumeViewerContext>
  );
}
