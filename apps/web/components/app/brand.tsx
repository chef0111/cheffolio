import type { Route } from 'next';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface BrandPropsWithSvg extends Omit<
  React.ComponentProps<'svg'>,
  'xmlns' | 'viewBox' | 'fill' | 'href'
> {
  href?: Route | null;
  showText?: boolean;
  size?: number;
  containerClassName?: string;
  textClassName?: string;
}

export function Brand({
  href,
  className,
  containerClassName,
  ...svgProps
}: BrandPropsWithSvg) {
  const content = (
    <div
      className={cn(
        'flex items-center justify-center gap-2',
        containerClassName
      )}
    >
      <BrandMark {...svgProps} className={cn('h-8 w-auto', className)} />
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="flex-center" aria-label="Home">
      {content}
    </Link>
  );
}

export const BrandMark = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 360 200"
    fill="none"
    aria-hidden
    {...props}
  >
    <path
      d="M40 0h120v40H40ZM0 40h40v120H0ZM80 80h80v80H120v-40H80ZM40 160h80v40H40ZM200 0h120v40H240v40h80v40H240v40h80v40H200ZM320 40h40v40H320ZM320 120h40v40H320ZM331 53 331 56 328 56 328 59 325 59 325 62 328 62 328 65 331 65 331 68 334 68 334 65 331 65 331 62 328 62 328 59 331 59 331 56 334 56 334 53ZM340 51 337 70 339 70 342 51ZM346 53 346 56 349 56 349 59 352 59 352 62 349 62 349 65 346 65 346 68 349 68 349 65 352 65 352 62 355 62 355 59 352 59 352 56 349 56 349 53ZM327 131 327 135 331 135 331 139 335 139 335 143 331 143 331 147 327 147 327 151 331 151 331 147 335 147 335 143 339 143 339 139 335 139 335 135 331 135 331 131ZM343 147h12v4H343Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);
