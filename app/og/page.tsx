import type { Metadata } from 'next';

import { BrandMark } from '@/components/cheffolio/brand';
import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';
import { PanelContent } from '@/components/cheffolio/panel';

export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

export default function OgPage() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center">
      <div className="flex h-screen w-[80vw] flex-col justify-center border-x md:w-2xl lg:w-4xl">
        <PanelContent className="decor-dl flex h-80 w-full flex-col items-center justify-center gap-4 self-center p-0 **:data-[slot=panel-plus]:size-8 md:h-120 md:gap-8 [&_[data-slot=panel-plus]_svg]:size-6">
          <FullWidthDivider position="top" className="bg-border" />
          <FullWidthDivider position="bottom" className="bg-border" />
          <BrandMark className="h-24 w-auto md:h-42" />
          <span className="font-pixel text-2xl tracking-tight md:text-5xl">
            giabao.dev
          </span>
        </PanelContent>
      </div>
    </div>
  );
}
