'use client';

import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePathname } from 'next/navigation';
import { haptic } from '@/lib/haptic';
import { NavItem } from './nav';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import Link from 'next/link';

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery('(min-width: 40rem)'); // sm breakpoint

  const pathname = usePathname();

  const handleOpenChange = useCallback((open: boolean) => {
    haptic();
    setOpen(open);
  }, []);

  if (isDesktop) {
    return <MobileNavTrigger />;
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <MobileNavTrigger />
      </PopoverTrigger>

      <PopoverContent
        className="w-56 rounded-xl border p-1"
        side="top"
        sideOffset={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col">
          {items.map((link) => {
            const active =
              pathname === link.href ||
              (link.href === '/' // Home page
                ? ['/', '/index'].includes(pathname || '')
                : pathname?.startsWith(link.href));

            const Icon = link?.icon ?? React.Fragment;

            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={active}
                className="data-active:bg-accent flex items-center gap-3 rounded-lg px-3 py-1.5 text-base"
                onClick={() => handleOpenChange(false)}
              >
                <Icon className="text-muted-foreground size-4" />
                <span>{link.title}</span>
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MobileNavTrigger(
  props: Omit<React.ComponentProps<typeof Button>, 'children'>
) {
  return (
    <Button
      type="button"
      className="group extend-touch-target data-open:bg-accent flex flex-col gap-1 border-none"
      variant="ghost"
      size="icon-sm"
      data-slot="popover-trigger"
      aria-label="Toggle Menu"
      {...props}
    >
      <span className="flex h-0.5 w-4 items-center justify-center transition-transform duration-150 ease-out group-data-[state=closed]:delay-150 group-data-[state=open]:translate-y-1.5 group-data-[state=open]:delay-0">
        <span className="bg-foreground block h-full w-full origin-center rounded-[1px] transition-transform duration-150 ease-out group-data-[state=closed]:delay-0 group-data-[state=open]:rotate-45 group-data-[state=open]:delay-150" />
      </span>
      <span className="bg-foreground flex h-0.5 w-4 rounded-[1px] transition-opacity duration-150 ease-out group-data-[state=open]:opacity-0" />
      <span className="flex h-0.5 w-4 items-center justify-center transition-transform duration-150 ease-out group-data-[state=closed]:delay-150 group-data-[state=open]:-translate-y-1.5 group-data-[state=open]:delay-0">
        <span className="bg-foreground block h-full w-full origin-center rounded-[1px] transition-transform duration-150 ease-out group-data-[state=closed]:delay-0 group-data-[state=open]:-rotate-45 group-data-[state=open]:delay-150" />
      </span>
    </Button>
  );
}
