import { SiteFooter } from '@/components/layout/footer';
import { SiteHeader } from '@/components/layout/header';
import { SiteFooterNav } from '@/components/layout/navigation/site-footer-nav';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/layout">
      <SiteHeader />
      <main className="max-w-screen overflow-x-hidden px-2">{children}</main>
      <SiteFooter />
      <ScrollFadeOverlay align="top" />
      <ScrollFadeOverlay align="bottom" />
      <SiteFooterNav />
    </div>
  );
}

function ScrollFadeOverlay({ align }: { align: 'top' | 'bottom' }) {
  const isTop = align === 'top';

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 z-50',
        isTop
          ? 'scroll-fade-effect-top -top-0.5'
          : 'scroll-fade-effect-bottom -bottom-0.5'
      )}
      aria-hidden
    >
      <div
        className={cn(
          'to-background from-transparent backdrop-blur-[1px]',
          isTop
            ? 'h-(--fade-top-height) bg-linear-to-t mask-linear-[to_bottom,var(--background)_25%,transparent]'
            : 'h-(--fade-bottom-height) bg-linear-to-b mask-linear-[to_top,var(--background)_25%,transparent]'
        )}
      />
      <div
        className={cn(
          'bg-background',
          isTop
            ? 'pb-[env(safe-area-inset-top,0)]'
            : 'pb-[env(safe-area-inset-bottom,0)]'
        )}
      />
    </div>
  );
}
