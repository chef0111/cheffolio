import type { Metadata } from 'next';

import { simpleOgImageUrl } from '@/app/og/params';
import { NotFound } from '@/components/not-found';

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
    <div className="flex min-h-screen flex-col items-center gap-8 max-md:pt-10 md:justify-center">
      <div className="mask-b-from-20% mask-b-to-100% text-7xl font-extrabold select-none!">
        404
      </div>

      <section className="w-full min-w-0 px-3 pb-6 sm:px-1">
        <NotFound emptyTitle={title} emptyDescription={description} />
      </section>
    </div>
  );
}
