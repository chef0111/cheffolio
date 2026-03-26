import { ArrowUpRightIcon } from 'lucide-react';
import Image from 'next/image';

import { UTM_PARAMS } from '@/config/site';
import type { SocialLink } from '@/modules/portfolio/types/social-links';
import { cn } from '@/lib/utils';
import { addQueryParams } from '@/utils/url';
import { GridPattern } from '@/components/cheffolio/grid-pattern';

export function SocialLinkItem({ icon, title, href }: SocialLink) {
  return (
    <a
      className={cn(
        'group hover:bg-accent-muted relative flex items-center gap-4 p-4 pr-2 transition-[background-color] ease-out',
        'max-md:nth-[2n+1]:screen-line-top max-md:nth-[2n+1]:screen-line-bottom',
        'md:nth-[3n+1]:screen-line-top md:nth-[3n+1]:screen-line-bottom'
      )}
      href={addQueryParams(href, UTM_PARAMS)}
      target="_blank"
      rel="noopener"
    >
      <div className="relative size-8 shrink-0">
        <Image
          className="corner-squircle rounded-lg select-none supports-corner-shape:rounded-[50%]"
          src={icon}
          alt={title}
          width={32}
          height={32}
          quality={100}
          unoptimized
        />
        <div className="corner-squircle pointer-events-none absolute inset-0 rounded-lg ring-1 ring-black/10 ring-inset supports-corner-shape:rounded-[50%] dark:ring-white/15" />
      </div>

      <h3 className="flex-1 font-medium">{title}</h3>

      <div className="pointer-events-none absolute top-0 right-0 size-full overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full mask-[radial-gradient(farthest-side_at_top,white,transparent)]">
          <GridPattern
            className="stroke-border absolute inset-0 size-full"
            height={24}
            width={24}
            x={-12}
            y={4}
          />
        </div>
      </div>

      <ArrowUpRightIcon className="text-muted-foreground size-4 transition-[rotate] duration-300 group-hover:rotate-45" />
    </a>
  );
}
