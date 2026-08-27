import { DownloadIcon, FileUser } from 'lucide-react';

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from '@/components/cheffolio/intro-item';
import { Button } from '@/components/ui/button';
import { UTM_PARAMS } from '@/config/site';
import { USER } from '@/features/portfolio/data/user';
import { addQueryParams } from '@/utils/url';

export function ResumeItem() {
  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <FileUser />
      </IntroItemIcon>

      <IntroItemContent>
        <IntroItemLink
          href={addQueryParams(USER.resume!, UTM_PARAMS)}
          aria-label="Personal resume"
          target="_blank"
          rel="noopener noreferrer"
        >
          Personal Resume
        </IntroItemLink>
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
              rel="noopener noreferrer"
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
