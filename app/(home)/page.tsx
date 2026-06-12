import type { Metadata } from 'next';
import type { ProfilePage, WithContext } from 'schema-dts';

import { TailwindSeparator } from '@/components/cheffolio/tailwind-separator';
import { About } from '@/features/portfolio/components/about';
import { Awards } from '@/features/portfolio/components/awards';
import { Experiences } from '@/features/portfolio/components/experiences';
import { Overview } from '@/features/portfolio/components/overview';
import { ProfileHeader } from '@/features/portfolio/components/profile-header';
import { Projects } from '@/features/portfolio/components/projects';
import { SocialLinks } from '@/features/portfolio/components/social-links';
import { TechStack } from '@/features/portfolio/components/tech-stack';
import { USER } from '@/features/portfolio/data/user';
import { JsonLdScript } from '@/lib/json-ld';

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
        className="mx-auto md:max-w-4xl *:[[id]]:scroll-mt-22"
        aria-label="Portfolio"
      >
        <ProfileHeader />
        <TailwindSeparator />

        <Overview />
        <SocialLinks />
        <TailwindSeparator />

        <About />
        <TailwindSeparator />

        <TechStack />
        <TailwindSeparator />

        <Experiences />
        <TailwindSeparator />

        <Projects />
        <TailwindSeparator />

        <Awards />
        <TailwindSeparator />
      </div>
    </>
  );
}

function getPageJsonLd(): WithContext<ProfilePage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: new Date(USER.dateCreated).toISOString(),
    mainEntity: {
      '@type': 'Person',
      name: USER.displayName,
      identifier: USER.username,
      image: USER.avatar,
      alternateName: USER.alternateName,
      description: USER.bio,
      jobTitle: USER.jobTitle,
      sameAs: Object.values(USER.socialLinks),
      knowsAbout: USER.skills,
    },
  };
}
