import type { Metadata } from 'next';
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
import { CreateFallback } from '@/features/create/components/create-fallback';
import { CreateWorkspace } from '@/features/create/components/create-workspace';

const title = 'Create';
const description = 'The Full-stack React Starter Kit for your next project';
const ogImage = simpleOgImageUrl(title, description);
const CREATE_PATH = '/create';

export function generateMetadata(): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: CREATE_PATH,
    },
    openGraph: {
      url: CREATE_PATH,
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

export default function CreatePage() {
  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: 'Home', href: '/' },
          { name: 'Create', href: CREATE_PATH },
        ])}
      />

      <div className="mx-auto flex w-full flex-1 flex-col">
        <PageHeading className="pt-26">
          <PageHeadingTitle className="decor-t screen-line-bottom-none pt-2 pb-0">
            {title}
          </PageHeadingTitle>
          <PageHeadingDescription className="pt-0 pb-2">
            {description}
          </PageHeadingDescription>
        </PageHeading>

        <StripeSeparator />

        <Suspense fallback={<CreateFallback />}>
          <CreateWorkspace />
        </Suspense>
      </div>
      <StripeSeparator />
    </>
  );
}
