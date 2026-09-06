import { GridDivider } from '@/components/cheffolio/grid-divider';
import { Panel } from '@/components/cheffolio/panel';
import { SOCIAL, SOCIAL_LINKS } from '@/features/portfolio/data/social-links';

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

        <GridDivider className="gap-2 max-md:hidden" rows={desktop} />
        <GridDivider className="grid gap-2 md:hidden" rows={mobile} />

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
