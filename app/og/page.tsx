import type { Metadata } from 'next';

import { BrandMark } from '@/components/cheffolio/brand';
import { Panel } from '@/components/cheffolio/panel';

export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

export default function OgPage() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center overflow-hidden">
      <div className="flex h-screen w-[80vw] flex-col justify-center border-x md:w-2xl lg:w-4xl">
        <Panel className="decor-all flex h-80 w-full flex-col items-center justify-center gap-4 self-center border-x-0 **:data-[slot=panel-plus]:size-8 **:data-[slot=panel-plus-background]:size-12 md:h-120 md:gap-8">
          <BrandMark className="h-24 w-auto md:h-42" />
          <span className="font-pixel text-2xl tracking-tight md:text-5xl">
            giabao.dev
          </span>
        </Panel>
      </div>
    </div>
  );
}
