import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare } from 'geist/font/pixel';
import { GeistSans } from 'geist/font/sans';

import { cn } from '@/lib/utils';

const fontSans = GeistSans;
const fontMono = GeistMono;

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  GeistPixelSquare.variable,
  '[--font-sans:var(--font-geist-sans)]',
  '[--font-mono:var(--font-geist-mono)]'
);
