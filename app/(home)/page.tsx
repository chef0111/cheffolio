import { cn } from '@/lib/utils';
import { USER } from '@/modules/portfolio/data/user';
import { ProfilePage, WithContext } from 'schema-dts';
import { ProfileCover } from '@/modules/portfolio/components/profile-cover';
import { FullWidthDivider } from '@/components/ui/full-width-divider';
import { ProfileHeader } from '@/modules/portfolio/components/profile-header';
import { TailwindSeparator } from '@/components/tailwind-separator';
import { Overview } from '@/modules/portfolio/components/overview';
import { SocialLinks } from '@/modules/portfolio/components/social-links';

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
        className={cn(
          'mx-auto overflow-x-hidden md:max-w-4xl *:[[id]]:scroll-mt-22'
        )}
      >
        <ProfileCover />
        <FullWidthDivider />
        <ProfileHeader />
        <TailwindSeparator />

        <Overview />
        <SocialLinks />
      </main>
    </>
  );
}

function getPageJsonLd(): WithContext<ProfilePage> {
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
