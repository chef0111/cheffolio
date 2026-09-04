'use client';

import { ProgressProvider } from '@bprogress/next/app';
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
      <ProgressProvider
        color="var(--foreground)"
        height="2px"
        delay={500}
        options={{ showSpinner: false }}
      >
        <CommandMenuProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <CommandMenuDialog />
        </CommandMenuProvider>
      </ProgressProvider>
      <Toaster position="bottom-center" closeButton />
    </ThemeProvider>
  );
}
