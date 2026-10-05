import { type ReactNode, ViewTransition } from 'react';

export const BLOG_NAV_FORWARD = 'nav-forward';

export function blogOgTransitionName(slug: string) {
  return `blog-og-${slug}`;
}

export function BlogOgTransition({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition
      name={blogOgTransitionName(slug)}
      share={{ [BLOG_NAV_FORWARD]: 'morph', default: 'none' }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
