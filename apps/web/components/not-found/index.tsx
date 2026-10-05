'use client';

import dynamic from 'next/dynamic';

import { NotFoundLoading } from './loading-status';

export const NotFound = dynamic(
  () => import('./game').then((mod) => mod.NotFound),
  {
    ssr: false,
    loading: () => <NotFoundLoading />,
  }
);
