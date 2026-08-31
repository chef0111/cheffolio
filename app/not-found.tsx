import { ArrowRightIcon, SearchXIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { simpleOgImageUrl } from '@/app/og/params';
import { NotFound } from '@/components/not-found';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

const title = 'Page not found';
const description =
  'The page you are looking for does not exist or has been moved.';
const ogImage = simpleOgImageUrl(title, description);

export const metadata: Metadata = {
  title,
  openGraph: {
    images: {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    },
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogImage],
  },
};

export default function NotFoundPage() {
  return (
    <div>
      <Empty className="py-8 sm:py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>

          <EmptyTitle className="text-base">{title}</EmptyTitle>

          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/" aria-label="Go to Home" />}
          >
            Go to Home
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </EmptyContent>
      </Empty>

      <section className="w-full min-w-0 px-3 pb-6 sm:px-1">
        <NotFound />
      </section>
    </div>
  );
}
