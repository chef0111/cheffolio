import dynamic from 'next/dynamic';

import { SiteFooter } from '@/components/layout/footer';
import { SiteHeader } from '@/components/layout/header';
import { SiteFooterNav } from '@/components/layout/navigation/site-footer-nav';

const ScrollToTop = dynamic(() =>
  import('@/components/cheffolio/scroll-to-top').then((mod) => mod.ScrollToTop)
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/layout">
      <SiteHeader />
      <main className="max-w-screen overflow-x-hidden px-2">{children}</main>
      <SiteFooter />
      <div
        className="scroll-fade-effect-bottom pointer-events-none fixed inset-x-0 -bottom-0.5 z-50"
        aria-hidden
      >
        <div className="to-background h-(--fade-bottom-height) bg-linear-to-b from-transparent mask-linear-[to_top,var(--background)_25%,transparent] backdrop-blur-[1px]" />
        <div className="bg-background pb-[env(safe-area-inset-bottom,0)]" />
      </div>
      <SiteFooterNav />
      <ScrollToTop />
    </div>
  );
}
