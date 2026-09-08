import type { ComponentProps } from 'react';

import { CopyButton } from '@/components/cheffolio/copy-button';
import { cn } from '@/lib/utils';

export const mdxCodeBlockComponents = {
  figure({ className, ...props }: ComponentProps<'figure'>) {
    const hasPrettyCode = 'data-rehype-pretty-code-figure' in props;

    return (
      <figure
        className={cn(hasPrettyCode && 'not-typeset', className)}
        {...props}
      />
    );
  },
  figcaption: ({ children, ...props }: ComponentProps<'figcaption'>) => {
    return <figcaption {...props}>{children}</figcaption>;
  },
  pre({
    __withMeta__,
    __rawString__,
    className,
    ...props
  }: ComponentProps<'pre'> & {
    __withMeta__?: boolean;
    __rawString__?: string;
  }) {
    return (
      <div className="group/pre bg-code relative rounded-[10px] border">
        <pre
          className={cn(
            __rawString__ && !__withMeta__ && '[--code-padding-right:6rem]',
            className
          )}
          {...props}
        />

        {__rawString__ ? (
          <CopyButton
            data-slot="copy-button"
            className={cn(
              "text-muted-foreground absolute top-2 right-2 z-10 rounded-[6px] border-none [&_svg:not([class*='size-'])]:size-4",
              __withMeta__ && 'top-1.5 right-1.5 rounded-md',
              !__withMeta__ && 'opacity-0 group-hover/pre:opacity-100'
            )}
            variant="ghost"
            size="icon-xs"
            text={__rawString__}
          />
        ) : null}
      </div>
    );
  },
};
