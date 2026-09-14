'use client';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  MaximizeIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@/components/ui/button-group';
import { cn } from '@/lib/utils';

import { ResumeViewerProvider, useResumeViewer } from './resume-viewer-context';
import { ResumeViewerPlaceholder } from './resume-viewer-placeholder';

const PdfPages = dynamic(
  () => import('./pdf-pages').then((module) => module.PdfPages),
  { ssr: false, loading: () => <ResumeViewerPlaceholder /> }
);

/** Root: owns document URL, page count, current page, and zoom. */
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
  const { numPages, currentPage, zoom, goToPage, zoomIn, zoomOut, fitWidth } =
    useResumeViewer();

  const isLoaded = numPages > 0;
  const canGoPrevious = isLoaded && currentPage > 1;
  const canGoNext = isLoaded && currentPage < numPages;
  const isFitWidth = zoom === 1;

  return (
    <div
      data-slot="resume-viewer-toolbar"
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 p-2',
        className
      )}
      {...props}
    >
      <ButtonGroup aria-label="Pages">
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label="Previous page"
          disabled={!canGoPrevious}
          onClick={() => goToPage(currentPage - 1)}
        >
          <ChevronUpIcon />
        </Button>
        <ButtonGroupSeparator />
        <ButtonGroupText className="bg-secondary min-w-16 justify-center border-transparent font-mono text-xs tabular-nums">
          {isLoaded ? `${currentPage} / ${numPages}` : '– / –'}
        </ButtonGroupText>
        <ButtonGroupSeparator />
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label="Next page"
          disabled={!canGoNext}
          onClick={() => goToPage(currentPage + 1)}
        >
          <ChevronDownIcon />
        </Button>
      </ButtonGroup>

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
        <ButtonGroupSeparator />
        <ButtonGroupText className="bg-secondary min-w-14 justify-center border-transparent font-mono text-xs tabular-nums">
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
        <ButtonGroupSeparator />
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
  const { viewportRef } = useResumeViewer();

  return (
    <div
      ref={viewportRef}
      data-slot="resume-viewer-viewport"
      className={cn(
        'bg-muted/60 dark:bg-muted/20 h-[calc(100svh-14rem)] min-h-120 overflow-auto p-4',
        className
      )}
      {...props}
    />
  );
}

/** Lazily loads react-pdf on the client only. */
export function ResumeViewerPages() {
  return <PdfPages />;
}
