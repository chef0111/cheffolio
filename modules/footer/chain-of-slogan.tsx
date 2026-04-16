import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const chainItemVariants = cva('hover:text-foreground transition-colors', {
  variants: {
    variant: {
      default: ' border-line border-x first:border-l-2 last:border-r-2',
      secondary:
        'bg-secondary text-secondary-foreground rounded-md mr-1 last:mr-0 hover:bg-secondary/80',
      outline:
        'border border-line rounded-md mr-1 last:mr-0 bg-background hover:bg-muted text-muted-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
      ghost: 'text-muted-foreground hover:bg-muted rounded-md mr-1 last:mr-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type ChainOfSloganProps = VariantProps<typeof chainItemVariants> & {
  className?: string;
  slogan: string;
};

export const ChainOfSlogan = ({
  className,
  slogan,
  variant,
}: ChainOfSloganProps) => {
  const normalizedSlogan = slogan.trim().replace(/\s+/g, ' ');

  return (
    <ul
      className={cn(
        'text-muted-foreground mx-auto flex items-center text-sm font-medium',
        className
      )}
    >
      {Array.from(normalizedSlogan).map((character, index) => (
        <li
          key={`${character}-${index}`}
          className={chainItemVariants({ variant })}
        >
          <span className="flex h-6 items-center px-1.5 text-center font-mono uppercase select-none sm:h-8 sm:px-3 sm:font-semibold">
            {character === ' ' ? '•' : character}
          </span>
        </li>
      ))}
    </ul>
  );
};
