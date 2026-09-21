'use client';

import { HomeIcon, RotateCwIcon, SearchXIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { useNotFoundGame } from './context';

export function ClearedOverlay({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const {
    actions: { restart },
  } = useNotFoundGame();

  return (
    <div className="absolute inset-0 z-50 grid place-items-center">
      <Empty className="py-8 sm:py-12 sm:pb-8">
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle className="text-base">{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button type="button" variant="outline" onClick={restart}>
            <RotateCwIcon data-icon="inline-start" />
            Restart Game
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/" aria-label="Go to Home" />}
          >
            <HomeIcon data-icon="inline-start" />
            Go Home
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
