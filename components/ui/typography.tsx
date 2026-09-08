import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { LinkIcon } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

function Prose({
  className,
  render,
  ...props
}: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        'data-slot': 'prose',
        className: cn('typeset max-w-none', className),
      } as React.ComponentProps<'div'>,
      props
    ),
  });
}

function ProseMono({
  className,
  ...props
}: React.ComponentProps<typeof Prose>) {
  return (
    <Prose className={cn('text-foreground font-mono', className)} {...props} />
  );
}

function Code({ className, ...props }: React.ComponentProps<'code'>) {
  const isCodeBlock = 'data-language' in props;

  return (
    <code
      data-slot={isCodeBlock ? 'code-block' : 'code-inline'}
      className={className}
      {...props}
    />
  );
}

type HeadingTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingProps<T extends HeadingTypes> = React.ComponentProps<T> & {
  as?: T;
};

function Heading<T extends HeadingTypes = 'h1'>({
  as,
  className,
  ...props
}: HeadingProps<T>): React.ReactElement {
  const Comp = as ?? 'h1';

  if (!props.id) {
    return <Comp className={className} {...props} />;
  }

  return (
    <Comp
      className={cn('flex flex-row items-center gap-2', className)}
      {...props}
    >
      <a
        href={`#${props.id}`}
        className="peer not-typeset"
        title="Link to section"
      >
        {props.children}
      </a>

      <LinkIcon
        className="text-muted-foreground size-4 shrink-0 translate-y-px opacity-0 transition-opacity peer-hover:opacity-100"
        aria-label="Link to section"
      />
    </Comp>
  );
}

export { Code, Heading, Prose, ProseMono };
