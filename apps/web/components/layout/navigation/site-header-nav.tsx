'use client';

import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';

export function SiteHeaderNav({ children }: { children?: React.ReactNode }) {
  const scrolled = useScroll(10);

  return (
    <div className="not-found-hidden sticky top-0 z-100 mx-auto w-full max-w-4xl shrink-0 group-data-[layout=wide]/layout:container [@media(max-width:896px)]:max-w-[calc(100%-1rem)]">
      <header
        className={cn(
          'border-x-border screen-line-top screen-line-bottom bg-background ease-out-cubic rounded-none border border-y-transparent transition-[translate,margin,border-color,border-radius,background-color,box-shadow] duration-200 before:z-0 after:z-0 motion-reduce:duration-150',
          scrolled &&
            'border-border bg-background/95 screen-line-top-none screen-line-bottom-none supports-backdrop-filter:bg-background/50 mx-2 translate-y-2 rounded-lg shadow backdrop-blur-md motion-reduce:translate-y-0'
        )}
        aria-label="Site header"
      >
        <nav className="relative z-1 flex h-(--header-height) w-full items-center justify-between px-2.5">
          {children}
        </nav>
      </header>
    </div>
  );
}
