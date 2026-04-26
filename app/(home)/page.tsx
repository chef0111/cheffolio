import type { Metadata } from 'next';
import type { ProfilePage, WithContext } from 'schema-dts';

import { TailwindSeparator } from '@/components/cheffolio/tailwind-separator';
import { Footer } from '@/components/layout/footer';
import { About } from '@/features/portfolio/components/about';
import { Awards } from '@/features/portfolio/components/awards';
import { Experiences } from '@/features/portfolio/components/experiences';
import { Overview } from '@/features/portfolio/components/overview';
import { ProfileHeader } from '@/features/portfolio/components/profile-header';
import { Projects } from '@/features/portfolio/components/projects';
import { SocialLinks } from '@/features/portfolio/components/social-links';
import { TechStack } from '@/features/portfolio/components/tech-stack';
import { USER } from '@/features/portfolio/data/user';

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
