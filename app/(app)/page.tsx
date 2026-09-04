import type { Metadata } from 'next';
import type { ProfilePage, WithContext } from 'schema-dts';

import { StripeSeparator } from '@/components/cheffolio/stripe-separator';
import { JsonLdScript } from '@/components/json-ld';
import { JSON_LD_ID } from '@/config/json-ld';
import { About } from '@/features/portfolio/components/about';
import { Awards } from '@/features/portfolio/components/awards';
import { Experiences } from '@/features/portfolio/components/experiences';
import { Overview } from '@/features/portfolio/components/overview';
import { ProfileHeader } from '@/features/portfolio/components/profile-header';
import { Projects } from '@/features/portfolio/components/projects';
import { SocialLinks } from '@/features/portfolio/components/social-links';
import { TechStack } from '@/features/portfolio/components/tech-stack';
import { USER } from '@/features/portfolio/data/user';
import { absoluteUrl } from '@/lib/utils';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  return (
    <>
      <JsonLdScript data={getPageJsonLd()} />

      <div
        className="mx-auto **:data-[slot=panel]:scroll-mt-22 md:max-w-4xl"
        aria-label="Portfolio"
      >
        <ProfileHeader />
        <Overview />
        <SocialLinks />
        <StripeSeparator />

        <About />
        <StripeSeparator />

        <TechStack />
        <StripeSeparator />

        <Experiences />
        <StripeSeparator />

        <Projects />
        <StripeSeparator />

        <Awards />
        <StripeSeparator />
      </div>
    </>
  );
}

function getPageJsonLd(): WithContext<ProfilePage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': absoluteUrl('/'),
    dateCreated: new Date(USER.dateCreated).toISOString(),
    dateModified: new Date(USER.dateModified).toISOString(),
    mainEntity: { '@id': JSON_LD_ID.person },
  };
}
