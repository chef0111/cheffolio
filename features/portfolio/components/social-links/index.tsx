import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';
import { Panel } from '@/components/cheffolio/panel';
import { SOCIAL_LINKS } from '@/features/portfolio/data/social-links';
import { cn } from '@/lib/utils';

import { SocialLinkItem } from './social-link-item';

const MOBILE_COLS = 2;
const DESKTOP_COLS = 3;

function getRowCounts(total: number) {
  return {
    mobile: Math.ceil(total / MOBILE_COLS),
    desktop: Math.ceil(total / DESKTOP_COLS),
  } as const;
}

function getGridLines(index: number) {
  if (index !== 0) return;

  return 'screen-line-top';
}

export function SocialLinks() {
  const { mobile, desktop } = getRowCounts(SOCIAL_LINKS.length);

  return (
    <Panel className="screen-line-bottom-none screen-line-top-none">
      <h2 className="sr-only">Social Links</h2>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 gap-2 md:grid-cols-3">
          <div className="border-border border-r" />
          <div className="border-border border-l md:border-x" />
          <div className="border-border border-l max-md:hidden" />
        </div>

        <GridDivider className="max-md:hidden" rows={desktop} />
        <GridDivider className="hidden max-md:grid" rows={mobile} />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {SOCIAL_LINKS.map((link, index) => (
            <SocialLinkItem
              key={link.href}
              className={getGridLines(index)}
              {...link}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
}

function GridDivider({
  rows,
  className,
}: {
  rows: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 -z-1 grid gap-2',
        className
      )}
      style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="relative">
          {row > 0 && <FullWidthDivider contained className="top-0" />}
          {row < rows - 1 && (
            <FullWidthDivider contained className="bottom-0" />
          )}
        </div>
      ))}
    </div>
  );
}
