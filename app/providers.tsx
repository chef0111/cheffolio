'use client';

import { ThemeProvider } from 'next-themes';

import { CommandMenuDialog } from '@/components/cheffolio/command-menu';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CommandMenuProvider } from '@/context/command-menu-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem
      disableTransitionOnChange
      enableColorScheme
      storageKey="theme"
      defaultTheme="system"
      attribute="class"
    >
      <CommandMenuProvider>
        <TooltipProvider>{children}</TooltipProvider>
        <CommandMenuDialog />
      </CommandMenuProvider>
      <Toaster position="bottom-center" closeButton />
    </ThemeProvider>
  );
}
