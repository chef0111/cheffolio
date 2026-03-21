import { USER } from '@/modules/portfolio/data/user';

import { VerifiedIcon } from './verified-icon';
import Image from 'next/image';
import { TextFlip } from '@/components/ui/text-flip';

export function ProfileHeader() {
  return (
    <div className="border-line flex border-x">
      <div className="border-line shrink-0 border-r">
        <div className="relative mx-0.5 my-0.75 size-30 sm:size-40">
          <Image
            className="ring-border ring-offset-background rounded-full object-cover ring-1 ring-offset-2 select-none"
            alt="Avatar"
            fill
            src={USER.avatar}
            fetchPriority="high"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex grow items-end pb-1 pl-4">
          <div
            className="line-clamp-1 font-mono text-xs text-zinc-400 select-none max-sm:hidden dark:text-zinc-700"
            aria-hidden
          >
            {'Love coding catchy things :>'}
          </div>
        </div>

        <div className="border-line border-t">
          <div className="flex items-center gap-2 pl-4">
            <h1 className="-translate-y-px pt-2 text-3xl font-semibold tracking-tight">
              {USER.displayName}
            </h1>

            <VerifiedIcon
              className="text-info mt-2 size-4.5 select-none"
              aria-label="Verified"
            />
          </div>

          <div className="border-line h-12.5 border-t py-1 pl-4 sm:h-9">
            <TextFlip
              className="font-pixel-square text-muted-foreground text-sm text-balance"
              variants={{
                initial: { y: -10, opacity: 0 },
                animate: { y: -1, opacity: 1 },
                exit: { y: 10, opacity: 0 },
              }}
              interval={1.5}
            >
              {USER.flipSentences}
            </TextFlip>
          </div>
        </div>
      </div>
    </div>
  );
}
