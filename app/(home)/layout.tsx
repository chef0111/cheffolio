import dynamic from 'next/dynamic';
import { SiteHeader } from '@/modules/header';

const ScrollToTop = dynamic(() =>
  import('@/components/cheffolio/scroll-to-top').then((mod) => mod.ScrollToTop)
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/layout">
      <SiteHeader />
      <main className="max-w-full overflow-x-hidden px-2">{children}</main>
      <ScrollToTop />
    </div>
  );
}
