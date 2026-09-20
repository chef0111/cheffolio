'use client';

import { MaximizeIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@/components/ui/button-group';
import { cn } from '@/lib/utils';

import {
  ResumeViewerProvider,
  useResumePreviewReady,
  useResumeViewer,
} from '../../context/resume-viewer-provider';
import { ResumeViewerPlaceholder } from './resume-viewer-placeholder';

const PdfPages = dynamic(
  () => import('./pdf-pages').then((module) => module.PdfPages),
  { ssr: false }
);

/** Root: owns document URL, page count, and zoom. */
export function ResumeViewer({
  src,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { src: string }) {
  return (
    <ResumeViewerProvider src={src}>
      <div
        data-slot="resume-viewer"
        className={cn('flex flex-col', className)}
        {...props}
      >
        {children}
      </div>
    </ResumeViewerProvider>
  );
}

export function ResumeViewerToolbar({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { numPages, zoom, zoomIn, zoomOut, fitWidth } = useResumeViewer();

  const isLoaded = numPages > 0;
  const isFitWidth = zoom === 1;

  return (
    <div
      data-slot="resume-viewer-toolbar"
      className={cn('flex flex-wrap items-center justify-between', className)}
      {...props}
    >
      <ButtonGroup aria-label="Zoom">
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label="Zoom out"
          disabled={!isLoaded}
          onClick={zoomOut}
        >
          <ZoomOutIcon />
        </Button>
        <ButtonGroupSeparator className="ml-[-0.5px]" />
        <ButtonGroupText className="bg-secondary min-w-12 justify-center border-transparent text-xs tabular-nums">
          {Math.round(zoom * 100)}%
        </ButtonGroupText>
        <ButtonGroupSeparator />
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label="Zoom in"
          disabled={!isLoaded}
          onClick={zoomIn}
        >
          <ZoomInIcon />
        </Button>
        <ButtonGroupSeparator className="ml-[-0.5px] w-px" />
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label="Fit width"
          disabled={!isLoaded || isFitWidth}
          onClick={fitWidth}
        >
          <MaximizeIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}

/** Fixed-height scroll box the pages stack inside. */
export function ResumeViewerViewport({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="resume-viewer-viewport"
      className={cn(
        'bg-background aspect-3/4 min-h-120 w-full scrollbar-gutter-stable overflow-y-scroll p-4',
        className
      )}
      {...props}
    />
  );
}

/** Lazily loads react-pdf on the client only. */
export function ResumeViewerPages() {
  return (
    <div className="relative flex min-h-full w-full flex-col items-center">
      <ResumeViewerLoadingOverlay />
      <PdfPages />
    </div>
  );
}

function ResumeViewerLoadingOverlay() {
  const { isPreviewReady } = useResumePreviewReady();

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex items-center',
        isPreviewReady && 'pointer-events-none invisible'
      )}
    >
      <ResumeViewerPlaceholder />
    </div>
  );
}
