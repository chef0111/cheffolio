import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { simpleOgImageUrl } from '@/app/og/params';
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTitle,
} from '@/components/cheffolio/page-heading';
import { StripeSeparator } from '@/components/cheffolio/stripe-separator';
import { jsonLdBreadcrumbList, JsonLdScript } from '@/components/json-ld';
import { X_PROFILE } from '@/config/site';
import { StudioFallback } from '@/features/studio/components/studio-fallback';

const StudioWorkspace = dynamic(() =>
  import('@/features/studio/components/studio-workspace').then(
    (mod) => mod.StudioWorkspace
  )
);

const title = 'Studio';
const description = 'Copy a create-gb-app command and preview the folder tree';
const ogImage = simpleOgImageUrl(title, description);
const STUDIO_PATH = '/studio';

export function generateMetadata(): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: STUDIO_PATH,
    },
    openGraph: {
      url: STUDIO_PATH,
      type: 'website',
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: 'summary_large_image',
      site: X_PROFILE,
      creator: X_PROFILE,
      images: [ogImage],
    },
  };
}

export default function StudioPage() {
  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: 'Home', href: '/' },
          { name: 'Studio', href: STUDIO_PATH },
        ])}
      />

      <div className="mx-auto flex w-full flex-1 flex-col md:max-w-4xl">
        <PageHeading className="pt-26">
          <PageHeadingTitle className="decor-t screen-line-bottom-none pt-2 pb-0">
            {title}
          </PageHeadingTitle>
          <PageHeadingDescription className="pt-0 pb-2">
            {description}
          </PageHeadingDescription>
        </PageHeading>

        <StripeSeparator />

        <Suspense fallback={<StudioFallback />}>
          <StudioWorkspace />
        </Suspense>

        <StripeSeparator />
      </div>
    </>
  );
}
