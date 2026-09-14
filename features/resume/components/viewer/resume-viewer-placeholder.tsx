import { Spinner } from '@/components/ui/spinner';

/** A4-shaped white sheet shown while react-pdf or the document is loading. */
export function ResumeViewerPlaceholder() {
  return (
    <div
      data-slot="resume-viewer-placeholder"
      className="mx-auto flex aspect-[1/1.414] w-full max-w-3xl items-center justify-center bg-white shadow-sm"
    >
      <Spinner className="text-zinc-400" />
    </div>
  );
}
