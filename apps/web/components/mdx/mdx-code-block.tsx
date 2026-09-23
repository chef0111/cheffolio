import type { ComponentProps } from 'react';

import { CopyButton } from '@/components/cheffolio/copy-button';
import { cn } from '@/lib/utils';

import { getIconExtension } from './extensions/get-icon';

const copyButtonClassName =
  "text-muted-foreground z-10 border-none [&_svg:not([class*='size-'])]:size-4";

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
  figcaption: ({
    children,
    __rawString__,
    ...props
  }: ComponentProps<'figcaption'> & {
    __rawString__?: string;
  }) => {
    const iconExtension =
      'data-language' in props && typeof props['data-language'] === 'string'
        ? getIconExtension(props['data-language'])
        : null;

    const hasCodeTitle =
      'data-rehype-pretty-code-title' in props && typeof children === 'string';

    return (
      <figcaption {...props}>
        {iconExtension}
        {hasCodeTitle ? (
          <span className="min-w-0 flex-1 truncate">{children}</span>
        ) : (
          children
        )}
        {__rawString__ && (
          <CopyButton
            data-slot="copy-button"
            className={cn(copyButtonClassName, 'rounded-md')}
            variant="ghost"
            size="icon-xs"
            text={__rawString__}
          />
        )}
      </figcaption>
    );
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
      <div
        className={cn(
          'group/pre bg-code rounded-[10px] border',
          !__withMeta__ && 'relative'
        )}
      >
        <pre
          className={cn(
            __rawString__ && !__withMeta__ && '[--code-padding-right:6rem]',
            className
          )}
          {...props}
        />

        {__rawString__ && !__withMeta__ ? (
          <CopyButton
            data-slot="copy-button"
            className={cn(
              copyButtonClassName,
              'absolute top-2 right-2 opacity-0 group-hover/pre:opacity-100'
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

export function MDXCodeBlock({
  language,
  title,
  html,
  raw,
  className,
}: {
  language: string;
  title: string;
  html: string | null;
  raw: string;
  className?: string;
}) {
  const Figure = mdxCodeBlockComponents.figure;
  const Figcaption = mdxCodeBlockComponents.figcaption;

  return (
    <Figure
      className={cn(
        'my-0 flex h-full min-h-0 flex-1 flex-col overflow-hidden',
        className
      )}
      data-rehype-pretty-code-figure=""
    >
      <Figcaption
        data-rehype-pretty-code-title=""
        data-language={language}
        className="h-10 shrink-0"
        __rawString__={raw}
      >
        {title}
      </Figcaption>
      {html ? (
        <div
          className="bg-code [&_pre]:no-scrollbar min-h-0 flex-1 overflow-hidden rounded-lg border [&_pre]:h-full [&_pre]:overflow-y-auto [&_pre]:bg-transparent"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="group/pre bg-code relative min-h-0 flex-1 overflow-auto rounded-lg border">
          <pre className="no-scrollbar h-full overflow-auto p-4 font-mono text-sm [--code-padding-right:6rem]">
            <code>{raw}</code>
          </pre>
        </div>
      )}
    </Figure>
  );
}
