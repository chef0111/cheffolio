import { ArrowRightIcon, SearchXIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

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

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFoundPage() {
  return (
    <div>
      <Empty className="py-8 sm:py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>

          <EmptyTitle className="text-base">Page not found</EmptyTitle>

          <EmptyDescription>
            The page you are looking for does not exist or has been moved.
          </EmptyDescription>
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
