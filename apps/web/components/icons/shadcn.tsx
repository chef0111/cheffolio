import { cn } from '@/lib/utils';

import type { IconProps } from './type';

export function ShadcnIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      className={cn('text-black dark:text-white', className)}
      aria-hidden
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="m208 128-80 80M192 40 40 192"
      />
    </svg>
  );
}
