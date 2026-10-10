import type { Metadata } from 'next';

import { BrandMark } from '@/components/app/brand';
import { Panel, PanelDecor } from '@/components/app/panel';

export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

export default function OgPage() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center overflow-hidden lg:px-24">
      <div className="flex h-screen w-[80vw] flex-col justify-center border-x-3 md:w-2xl lg:w-full lg:max-w-5xl">
        <Panel className="screen-line-top-3 cover-background screen-line-bottom-3 flex h-80 w-full flex-col items-center justify-center gap-4 self-center border-x-0 **:data-[slot=panel-plus]:size-9 **:data-[slot=panel-plus-background]:size-17 **:data-[slot=panel-plus-icon]:stroke-2 md:h-120 md:gap-8">
          <PanelDecor position="top-left" className="-left-px" />
          <PanelDecor position="top-right" className="-right-px" />
          <PanelDecor position="bottom-left" className="-left-px" />
          <PanelDecor position="bottom-right" className="-right-px" />
          <BrandMark className="h-24 w-auto md:h-42" />
          <span className="font-pixel text-2xl tracking-tight md:text-5xl">
            giabao.dev
          </span>
        </Panel>
      </div>
    </div>
  );
}
