'use client';

import { useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useSound } from '@/hooks/use-sound';
import { useMetaColor } from '@/hooks/use-meta-color';
import { useHotkey } from '@tanstack/react-hotkeys';
import { META_THEME_COLORS, SOUNDS } from '@/config/site';

import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Kbd } from '@/components/ui/kbd';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  const playToggle = useSound(SOUNDS.toggle);

  const switchTheme = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    setMetaColor(
      resolvedTheme === 'dark'
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  const toggleTheme = useCallback(() => {
    playToggle(0.25);
    switchTheme();
  }, [playToggle, switchTheme]);

  useHotkey('D', () => switchTheme());

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="active:scale-100"
        >
          <SunIcon className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
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
