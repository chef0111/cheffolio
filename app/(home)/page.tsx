import { USER } from '@/modules/portfolio/data/user';
import { ProfilePage, WithContext } from 'schema-dts';
import { ProfileCover } from '@/modules/portfolio/components/profile-cover';
import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';
import { ProfileHeader } from '@/modules/portfolio/components/profile-header';
import { TailwindSeparator } from '@/components/cheffolio/tailwind-separator';
import { Overview } from '@/modules/portfolio/components/overview';
import { SocialLinks } from '@/modules/portfolio/components/social-links';
import { About } from '@/modules/portfolio/components/about';
import { headers } from 'next/headers';
import { GitHubContributions } from '@/modules/portfolio/components/github-contributions';
import { TechStack } from '@/modules/portfolio/components/tech-stack';
import { Experiences } from '@/modules/portfolio/components/experiences';
import { Projects } from '@/modules/portfolio/components/projects';

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd()).replace(/</g, '\\u003c'),
        }}
      />
      <main className="mx-auto md:max-w-4xl *:[[id]]:scroll-mt-22">
        <ProfileCover />
        <FullWidthDivider />
        <ProfileHeader />
        <TailwindSeparator />

        <Overview />
        <SocialLinks />
        <TailwindSeparator />

        <About />
        <GitHubContributions />
        <TailwindSeparator />

        <TechStack />
        <TailwindSeparator />

        <Experiences />
        <TailwindSeparator />

        <Projects />
        <TailwindSeparator />
      </main>
    </>
  );
}

async function getPageJsonLd(): Promise<WithContext<ProfilePage>> {
  await headers();

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: new Date(USER.dateCreated).toISOString(),
    dateModified: new Date().toISOString(),
    mainEntity: {
      '@type': 'Person',
      name: USER.displayName,
      identifier: USER.username,
      image: USER.avatar,
    },
  };
}
