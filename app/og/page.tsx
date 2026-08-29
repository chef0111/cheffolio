import type { Metadata } from 'next';

import { BrandMark } from '@/components/cheffolio/brand';

export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

export default function OgPage() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-6">
      <BrandMark className="h-24 w-auto" />
      <span className="font-pixel text-2xl tracking-tight">giabao.dev</span>
    </div>
  );
}
