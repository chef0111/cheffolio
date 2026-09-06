'use client';

import { useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { MoonIcon, SunIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { META_THEME_COLORS } from '@/config/site';
import { useTheme } from '@/context/theme-provider';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMetaColor } from '@/hooks/use-meta-color';
import { useSound } from '@/hooks/use-sound';
import { haptic } from '@/lib/haptic';
import { clickSoftSound } from '@/lib/soundcn/click-soft';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  const isMobile = useMediaQuery('(max-width: 640px)');
  const [playToggle] = useSound(clickSoftSound, { volume: 0.3 });

  const switchTheme = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    setMetaColor(
      resolvedTheme === 'dark'
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  const toggleTheme = useCallback(() => {
    playToggle();
    haptic();

    if (!document.startViewTransition || isMobile) switchTheme();
    else document.startViewTransition(switchTheme);
  }, [playToggle, switchTheme, isMobile]);

  useHotkeys(
    'd',
    () => {
      playToggle();
      setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
      setMetaColor(
        resolvedTheme === 'dark'
          ? META_THEME_COLORS.light
          : META_THEME_COLORS.dark
      );
    },
    { preventDefault: true }
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="active:scale-100"
          />
        }
      >
        <SunIcon className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-2">
          Toggle Mode
          <Kbd>D</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
