import { Navbar } from '@/modules/navbar';
import dynamic from 'next/dynamic';

const ScrollToTop = dynamic(() =>
  import('@/components/scroll-to-top').then((mod) => mod.ScrollToTop)
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/layout">
      <Navbar />
      <main className="overflow-x-hidden px-2">{children}</main>
      <ScrollToTop />
    </div>
  );
}
