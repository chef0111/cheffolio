import { DownloadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  RESUME_PDF_FILENAME,
  RESUME_PDF_PATH,
} from '@/features/resume/lib/constants';

export function DownloadResumeButton(
  props: Omit<React.ComponentProps<typeof Button>, 'render' | 'nativeButton'>
) {
  return (
    <Button
      size="sm"
      variant="secondary"
      className="gap-1.5 active:scale-none!"
      nativeButton={false}
      render={
        <a
          href={RESUME_PDF_PATH}
          download={RESUME_PDF_FILENAME}
          aria-label="Download resume as PDF"
        />
      }
      {...props}
    >
      <DownloadIcon data-icon="inline-start" />
      <span className="max-[28rem]:hidden">Download</span>
    </Button>
  );
}
