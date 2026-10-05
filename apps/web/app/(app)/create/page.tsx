import type { Metadata } from 'next';
import Image from 'next/image';

import { simpleOgImageUrl } from '@/app/og/params';
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTitle,
} from '@/components/cheffolio/page-heading';
import { StripeSeparator } from '@/components/cheffolio/stripe-separator';
import { jsonLdBreadcrumbList, JsonLdScript } from '@/components/json-ld';
import { X_PROFILE } from '@/config/site';
import { CreateWorkspace } from '@/features/create/components/create-workspace';

const title = 'Create';
const description = 'The Full-stack React Starter Kit for your next project';
const ogImage = simpleOgImageUrl(title, description);
const CREATE_PATH = '/create';

export function generateMetadata(): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
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
        <PageHeading className="pt-12">
          <PageHeadingTitle className="decor-t screen-line-bottom-none pt-2 pb-0">
            {title}
          </PageHeadingTitle>
          <PageHeadingDescription className="pt-0 pb-2">
            {description}
          </PageHeadingDescription>
        </PageHeading>

        <StripeSeparator />

        <section className="flex flex-1 flex-col items-center justify-center border-x px-4 pt-4 pb-12 text-center sm:pt-8 sm:pb-16">
          <Image
            src="https://assets.giabao.dev/create-under-construction.webp"
            alt="A crane assembling a web page"
            width={960}
            height={640}
            className="h-auto w-full max-w-md select-none! dark:invert"
          />
          <h2 className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl">
            This page is under construction
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md text-base text-balance">
            Create is still in development. Please check back later.
          </p>
        </section>
        {/* <CreateWorkspace /> */}
      </div>
      <StripeSeparator />
    </>
  );
}
