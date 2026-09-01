import type { Metadata } from 'next';

import { BrandMark } from '@/components/cheffolio/brand';
import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';
import { PanelPlus } from '@/components/cheffolio/panel';

export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

export default function OgPage() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center">
      <div className="flex h-screen w-[80vw] flex-col justify-center border-x md:w-2xl">
        <div className="relative flex h-80 w-full flex-col items-center justify-center gap-6 self-center">
          <PanelPlus position="top-left" className="size-8" />
          <PanelPlus position="bottom-right" className="size-8" />
          <FullWidthDivider position="top" className="bg-border" />
          <FullWidthDivider position="bottom" className="bg-border" />
          <BrandMark className="h-24 w-auto" />
          <span className="font-pixel text-2xl tracking-tight">giabao.dev</span>
        </div>
      </div>
    </div>
  );
}
