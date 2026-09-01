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
      <div className="flex h-screen w-[80vw] flex-col justify-center border-x md:w-2xl">
        <PanelContent className="decor-dl flex h-80 w-full flex-col items-center justify-center gap-6 self-center p-0 **:data-[slot=panel-plus]:size-8 [&_[data-slot=panel-plus]_svg]:size-6">
          <FullWidthDivider position="top" className="bg-border" />
          <FullWidthDivider position="bottom" className="bg-border" />
          <BrandMark className="h-24 w-auto" />
          <span className="font-pixel text-2xl tracking-tight">giabao.dev</span>
        </PanelContent>
      </div>
    </div>
  );
}
