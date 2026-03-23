import { SOCIAL_LINKS } from '@/modules/portfolio/data/social-links';
import { Panel } from '@/components/cheffolio/panel';
import { SocialLinkItem } from './item';

export function SocialLinks() {
  return (
    <Panel className="before:content-none after:content-none">
      <h2 className="sr-only">Social Links</h2>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 gap-2 md:grid-cols-3">
          <div className="border-line border-r" />
          <div className="border-line border-l md:border-x" />
          <div className="border-line border-l max-md:hidden" />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {SOCIAL_LINKS.map((link, index) => {
            return <SocialLinkItem key={index} {...link} />;
          })}
        </div>
      </div>
    </Panel>
  );
}
