import type { Metadata } from 'next';
import type { ProfilePage, WithContext } from 'schema-dts';

import { TailwindSeparator } from '@/components/cheffolio/tailwind-separator';
import { Footer } from '@/modules/footer';
import { About } from '@/modules/portfolio/components/about';
import { Awards } from '@/modules/portfolio/components/awards';
import { Experiences } from '@/modules/portfolio/components/experiences';
import { Overview } from '@/modules/portfolio/components/overview';
import { ProfileHeader } from '@/modules/portfolio/components/profile-header';
import { Projects } from '@/modules/portfolio/components/projects';
import { SocialLinks } from '@/modules/portfolio/components/social-links';
import { TechStack } from '@/modules/portfolio/components/tech-stack';
import { USER } from '@/modules/portfolio/data/user';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd()).replace(/</g, '\\u003c'),
        }}
      />
      <main
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

        <Footer />
      </main>
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
    },
  };
}
