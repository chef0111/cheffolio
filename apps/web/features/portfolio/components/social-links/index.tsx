import { FullWidthDivider } from '@/components/app/full-width-divider';
import { Panel } from '@/components/app/panel';
import { SOCIAL, SOCIAL_LINKS } from '@/features/portfolio/data/social-links';
import { cn } from '@/lib/utils';

import { SocialLinkItem } from './social-link-item';

const DESKTOP_ROWS = 2;
const MOBILE_ROWS = 3;

function getGridLines(index: number) {
  if (index !== 0) return;

  return 'screen-line-top';
}

export function SocialLinks() {
  return (
    <Panel className="screen-line-bottom-none decor-t screen-line-top-none">
      <h2 className="sr-only">Social Links</h2>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 gap-2 md:grid-cols-3">
          <div className="border-border border-r" />
          <div className="border-border border-l md:border-x" />
          <div className="border-border border-l max-md:hidden" />
        </div>

        <GridDivider className="gap-2 max-md:hidden" rows={DESKTOP_ROWS} />
        <GridDivider className="grid gap-2 md:hidden" rows={MOBILE_ROWS} />

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {SOCIAL_LINKS.map((item, index) => {
            const social = SOCIAL[item.name];
            return (
              <SocialLinkItem
                key={item.name}
                className={getGridLines(index)}
                {...social}
              />
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function GridDivider({
  rows,
  className,
  style,
  ...props
}: React.ComponentProps<'div'> & {
  rows: number;
}) {
  if (rows <= 0) return null;

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 grid', className)}
      style={{
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        ...style,
      }}
      {...props}
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
