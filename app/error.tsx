'use client';

import { HomeIcon, RotateCwIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full items-center justify-center overflow-hidden">
      <div className="flex h-screen items-center border-x">
        <div>
          <FullWidthDivider />
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Something went wrong</EmptyTitle>
              <EmptyDescription>
                This page failed to load. You can retry or go back home.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row flex-wrap justify-center">
              <Button onClick={reset}>
                <RotateCwIcon data-icon="inline-start" />
                Try again
              </Button>
              <Button
                variant="outline"
                render={<Link href="/" aria-label="Go home" />}
                nativeButton={false}
              >
                <HomeIcon data-icon="inline-start" />
                Go Home
              </Button>
            </EmptyContent>
          </Empty>
          <FullWidthDivider />
        </div>
      </div>
    </div>
  );
}
