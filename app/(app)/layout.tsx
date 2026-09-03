import { ScrollFadeOverlay } from '@/components/cheffolio/scroll-fade-overlay';
import { SiteFooter } from '@/components/layout/footer';
import { SiteHeader } from '@/components/layout/header';
import { SiteFooterNav } from '@/components/layout/navigation/site-footer-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/layout relative isolate overflow-hidden">
      <SiteHeader />
      <main className="max-w-screen overflow-x-clip px-2">{children}</main>
      <SiteFooter />
      <ScrollFadeOverlay align="top" fadeOut={false} />
      <ScrollFadeOverlay align="bottom" />
      <SiteFooterNav />
    </div>
  );
}
