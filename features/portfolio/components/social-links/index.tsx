import { DecorIcon } from '@/components/cheffolio/decor-icon';
import { Panel } from '@/components/cheffolio/panel';
import { SOCIAL_LINKS } from '@/features/portfolio/data/social-links';

import { getSocialLinkGridLines } from './social-link-grid-lines';
import { SocialLinkItem } from './social-link-item';

export function SocialLinks() {
  return (
    <Panel className="screen-line-bottom-none relative">
      <DecorIcon className="size-4" position="bottom-left" />
      <DecorIcon className="size-4" position="bottom-right" />
      <h2 className="sr-only">Social Links</h2>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 gap-2 md:grid-cols-3">
          <div className="border-border border-r" />
          <div className="border-border border-l md:border-x" />
          <div className="border-border border-l max-md:hidden" />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {SOCIAL_LINKS.map((link, index) => (
            <SocialLinkItem
              key={link.href}
              className={getSocialLinkGridLines(index, SOCIAL_LINKS.length)}
              {...link}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
}
