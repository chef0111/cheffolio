'use client';

import dynamic from 'next/dynamic';

export const PdfPages = dynamic(
  () => import('./pdf-pages-component').then((module) => module.PdfPages),
  { ssr: false }
);
