import Image from 'next/image';

import { DecorIcon } from '@/components/cheffolio/decor-icon';
import { TextFlip } from '@/components/cheffolio/text-flip';
import { VerifiedIcon } from '@/components/icons/verified-icon';
import { Label } from '@/components/ui/label';
import { USER } from '@/modules/portfolio/data/user';

import { AvatarElectric } from './avatar-eletric';

export function ProfileHeader() {
  return (
    <div className="border-line relative flex border-x">
      <DecorIcon className="size-4" position="top-left" />
      <DecorIcon className="size-4" position="top-right" />
      <DecorIcon className="size-4" position="bottom-left" />
      <DecorIcon className="size-4" position="bottom-right" />

      <div className="border-line relative shrink-0 border-r">
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-right" />
        <AvatarElectric>
          <div className="relative mx-0.5 my-0.75 size-32 sm:size-40">
            <Image
              className="ring-border ring-offset-background rounded-full object-cover ring-1 ring-offset-2 select-none"
              alt="Avatar"
              width={160}
              height={160}
              src={USER.avatar}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </AvatarElectric>
        <div className="bg-background ring-border ring-offset-background absolute right-3 bottom-3 flex size-5 items-center justify-center rounded-full border text-xs ring-1 ring-offset-2 select-none sm:right-3.5 sm:bottom-3.5 sm:size-6 sm:text-sm">
          😴
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex grow items-end pb-1 pl-4">
          <div
            className="line-clamp-1 font-mono text-xs text-zinc-400 select-none dark:text-zinc-600"
            aria-label="User bio"
          >
            {USER.bio}
          </div>
        </div>

        <div className="border-line border-t">
          <div className="flex flex-wrap items-center gap-2 pl-4">
            <div className="flex items-center gap-2 py-1">
              <h1 className="-translate-y-px truncate text-3xl leading-none font-semibold tracking-tight">
                {USER.displayName}
              </h1>

              <VerifiedIcon
                className="text-info size-4.5 py-0 select-none"
                aria-label="Verified"
              />
            </div>

            <Label className="text-muted-foreground text-lg leading-none font-light">
              @{USER.username}
            </Label>
          </div>

          <div
            className="border-line border-t py-1 pl-4"
            aria-label="Flip sentences"
          >
            <TextFlip
              className="font-pixel-square text-muted-foreground text-sm text-balance"
              variants={{
                initial: { y: -10, opacity: 0 },
                animate: { y: -1, opacity: 1 },
                exit: { y: 10, opacity: 0 },
              }}
              interval={2}
            >
              {USER.flipSentences}
            </TextFlip>
          </div>
        </div>
      </div>
    </div>
  );
}
