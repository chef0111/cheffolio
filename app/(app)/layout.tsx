import dynamic from 'next/dynamic';

import { ScrollFadeOverlay } from '@/components/cheffolio/scroll-fade-overlay';
import { SiteFooter } from '@/components/layout/footer';
import { SiteHeader } from '@/components/layout/header';
import { LayoutGroup } from '@/components/layout/layout-group';
import { SiteFooterNav } from '@/components/layout/navigation/site-footer-nav';
import { getBlogPosts } from '@/lib/document';
import type { DocPreview } from '@/types/document';

const ScrollToTop = dynamic(() =>
  import('@/components/cheffolio/scroll-to-top').then((mod) => mod.ScrollToTop)
);
const CommandMenuDialog = dynamic(() =>
  import('@/components/cheffolio/command-menu').then(
    (mod) => mod.CommandMenuDialog
  )
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const blogs = getBlogPosts();

  const blogPreviews: DocPreview[] = blogs.map((blog) => ({
    slug: blog.slug,
    title: blog.metadata.title,
    category: blog.metadata.category,
  }));

  return (
    <LayoutGroup>
      <SiteHeader />
      <CommandMenuDialog blogs={blogPreviews} />
      <main className="flex w-full max-w-screen flex-1 flex-col overflow-x-clip px-2">
        {children}
      </main>
      <ScrollToTop />
      <ScrollFadeOverlay align="top" fadeOut={false} />
      <ScrollFadeOverlay align="bottom" />
      <SiteFooterNav />
      <SiteFooter />
    </LayoutGroup>
  );
}
