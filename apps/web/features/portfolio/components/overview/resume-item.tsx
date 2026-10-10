import { DownloadIcon, FileUser } from 'lucide-react';
import Link from 'next/link';

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
} from '@/components/app/intro-item';
import { Button } from '@/components/ui/button';
import { DrawUnderline } from '@/components/ui/draw-underline';
import { RESUME_PDF_FILENAME } from '@/config/resume';
import { USER } from '@/features/portfolio/data/user';

export function ResumeItem() {
  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <FileUser />
      </IntroItemIcon>

      <IntroItemContent>
        <Link href={USER.resume!} aria-label="Personal resume">
          <DrawUnderline>Personal Resume</DrawUnderline>
        </Link>
      </IntroItemContent>

      <div className="ease-out-cubic -translate-x-3 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Download resume"
          render={
            <a
              href={USER.resumeDownloadUrl}
              download={RESUME_PDF_FILENAME}
              aria-label="Download resume"
            />
          }
          nativeButton={false}
        >
          <DownloadIcon />
          <span className="sr-only">Download resume</span>
        </Button>
      </div>
    </IntroItem>
  );
}
