import { cn } from '@/lib/utils';
import { USER } from '@/modules/portfolio/data/user';
import { ProfilePage, WithContext } from 'schema-dts';
import { ProfileCover } from '@/modules/portfolio/components/profile-cover';

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
          'mx-auto min-h-screen md:max-w-4xl *:[[id]]:scroll-mt-22'
        )}
      >
        <div className="cover-background h-14 w-full" />
        <ProfileCover />
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
