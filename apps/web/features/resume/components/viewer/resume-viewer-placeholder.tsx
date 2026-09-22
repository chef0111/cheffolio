import { Spinner } from '@/components/ui/spinner';

/** A4-shaped white sheet shown while react-pdf or the document is loading. */
export function ResumeViewerPlaceholder() {
  return (
    <div
      data-slot="resume-viewer-placeholder"
      className="text-muted-foreground mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center gap-3"
    >
      <Spinner className="size-8" />
      <span className="text-sm">Loading embedded resume…</span>
    </div>
  );
}
