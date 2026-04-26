import { DownloadIcon, FileUser } from 'lucide-react';

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from '@/components/cheffolio/intro-item';
import { Button } from '@/components/ui/button';
import { USER } from '@/features/portfolio/data/user';

export function ResumeItem() {
  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <FileUser />
      </IntroItemIcon>

      <IntroItemContent>
        <IntroItemLink
          href={USER.resume}
          aria-label="Personal resume"
          target="_blank"
          rel="noopener noreferrer"
        >
          Personal Resume
        </IntroItemLink>
      </IntroItemContent>

      <div className="-translate-x-3 opacity-0 transition-opacity ease-out group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground"
        >
          <DownloadIcon />
        </Button>
      </div>
    </IntroItem>
  );
}
