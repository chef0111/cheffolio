'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { BrandLogo } from '@/components/cheffolio/brand';
import { CanvasReveal } from '@/components/cheffolio/canvas-reveal';
import { Label } from '@/components/ui/label';
import { useMediaQuery } from '@/hooks/use-media-query';

export function ProfileCover() {
  return (
    <CanvasHover>
      <div className="z-20">
        <div className="flex flex-col items-center gap-3">
          <BrandLogo
            id="js-cover-mark"
            className="h-auto w-28 translate-y-5 transition duration-300 group-hover/canvas:translate-y-0 group-data-[expanded=true]/canvas:translate-y-0 sm:w-32"
          />
          <Label className="font-pixel text-lg opacity-0 transition duration-300 group-hover/canvas:opacity-100 group-data-[expanded=true]/canvas:opacity-100 sm:text-xl">
            giabao.dev
          </Label>
        </div>
      </div>
    </CanvasHover>
  );
}

function CanvasHover({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const isTouchDevice = useMediaQuery('(pointer: coarse)');
  const isExpanded = isTouchDevice && isActive;

  return (
    <div
      onMouseEnter={() => {
        setIsActive(true);
      }}
      onMouseLeave={() => {
        setIsActive(false);
      }}
      data-expanded={isExpanded ? 'true' : 'false'}
      className="group/canvas cover-background relative flex flex-col"
    >
      <div className="h-12 w-full" />
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 h-full w-full"
          >
            <CanvasReveal
              animationSpeed={3}
              containerClassName="cover-background border-none! hidden dark:block"
              colors={[
                [244, 244, 245],
                [228, 228, 231],
              ]}
            />
            <CanvasReveal
              animationSpeed={3}
              containerClassName="cover-background border-none! dark:hidden"
              colors={[
                [24, 24, 27],
                [39, 39, 42],
              ]}
            />
            <div className="bg-background absolute inset-0 mask-[radial-gradient(600px_at_center,white,transparent)]" />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}
