'use client';

import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';

import { ElectricBorder } from '@/components/cheffolio/electric-border';

const HOVER_DELAY_MS = 150;

export function AvatarElectric({ children }: { children: JSX.Element }) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoverTimeout = () => {
    if (!hoverTimeoutRef.current) return;

    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = null;
  };

  useEffect(() => {
    return () => {
      clearHoverTimeout();
    };
  }, []);

  const handleMouseEnter = () => {
    clearHoverTimeout();

    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, HOVER_DELAY_MS);
  };

  const handleMouseLeave = () => {
    clearHoverTimeout();
    setIsHovered(false);
  };

  return (
    <ElectricBorder
      chaos={0.05}
      borderRadius={999}
      color="#33a7ff"
      active={isHovered}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </ElectricBorder>
  );
}
