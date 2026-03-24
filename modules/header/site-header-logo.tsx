'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';
import { usePathname } from 'next/navigation';
import { Brand } from '@/components/cheffolio/brand';
import { useMediaQuery } from '@/hooks/use-media-query';

const calcDistance = (el: HTMLElement, mobile: boolean, tablet: boolean) => {
  const rect = el.getBoundingClientRect();
  const scrollTop = document.documentElement.scrollTop;
  const headerHeight = mobile ? 56 : tablet ? 50 : 62;
  return scrollTop + rect.top + rect.height - headerHeight;
};

function BrandMotion() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const mobile = useMediaQuery('(max-width: 640px)');
  const tablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const distanceRef = useRef(160);

  useMotionValueEvent(scrollY, 'change', (latestValue) => {
    setVisible(latestValue >= distanceRef.current);
  });

  useEffect(() => {
    const coverMark = document.getElementById('js-cover-mark');
    if (!coverMark) return;

    distanceRef.current = calcDistance(coverMark, mobile, tablet);

    const resizeObserver = new ResizeObserver(() => {
      distanceRef.current = calcDistance(coverMark, mobile, tablet);
    });
    resizeObserver.observe(coverMark);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mobile, tablet]);

  return (
    <Brand
      data-visible={visible}
      className="translate-y-2 opacity-0 transition-[opacity,translate] duration-300 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100"
    />
  );
}

export function SiteHeaderLogo() {
  const pathname = usePathname();
  const isHome = ['/', '/index'].includes(pathname);
  return isHome ? <BrandMotion /> : <Brand />;
}
