'use client';

import { ChevronDownIcon } from 'lucide-react';
import React from 'react';

import { CopyStateIcon } from '@/components/cheffolio/copy-button';
import {
  ClaudeIcon,
  GitHubIcon,
  MarkdownIcon,
  OpenAIIcon,
} from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CopyState } from '@/hooks/use-copy';

const cache = new Map<string, string>();

export function LLMCopyButton({ markdownUrl }: { markdownUrl: string }) {
  const [state, setState] = React.useState<CopyState>('idle');
  const [isCopying, setIsCopying] = React.useState(false);
  const operationRef = React.useRef(false);

  const handleCopy = async () => {
    if (operationRef.current) return;

    operationRef.current = true;

    const loadingTimer = setTimeout(() => {
      setIsCopying(true);
    }, 150);

    try {
      const cached = cache.get(markdownUrl);
      if (cached) {
        await navigator.clipboard.writeText(cached);
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': fetch(markdownUrl)
              .then((res) => {
                if (!res.ok) {
                  throw new Error('Failed to fetch markdown');
                }

                return res.text();
              })
              .then((content) => {
                cache.set(markdownUrl, content);
                return content;
              }),
          }),
        ]);
      }
      setState('done');
    } catch {
      setState('error');
    } finally {
      clearTimeout(loadingTimer);
      setIsCopying(false);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      operationRef.current = false;
      setState('idle');
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      className="-mr-px gap-1.5 active:scale-none!"
      aria-label="Copy"
      aria-busy={isCopying}
      disabled={isCopying}
      onClick={handleCopy}
    >
      <CopyStateIcon data-icon="inline-start" state={state} />
      <span className="max-[28rem]:hidden">Copy page</span>
    </Button>
  );
}

function getPrompt(url: string) {
  return `Read ${url}. I want to ask questions about it.`;
}

function getGitHubSourceUrl(markdownUrl: string) {
  const fileName = markdownUrl
    .replace(/^\/blog\//, '')
    .replace(/\.md$/, '.mdx');

  return `https://github.com/chef0111/cheffolio/blob/main/features/blog/content/${fileName}`;
}

export function ViewOptions({ markdownUrl }: { markdownUrl: string }) {
  const items = React.useMemo(() => {
    const fullMarkdownUrl =
      typeof window !== 'undefined'
        ? new URL(markdownUrl, window.location.origin).toString()
        : markdownUrl;

    const query = getPrompt(fullMarkdownUrl);

    const options = [
      {
        title: 'View as Markdown',
        href: fullMarkdownUrl,
        icon: MarkdownIcon,
      },
      {
        title: 'Open in GitHub',
        href: getGitHubSourceUrl(markdownUrl),
        icon: GitHubIcon,
      },
      {
        title: 'Open in ChatGPT',
        href: `https://chatgpt.com/?${new URLSearchParams({
          hints: 'search',
          q: query,
        })}`,
        icon: OpenAIIcon,
      },
      {
        title: 'Open in Claude',
        href: `https://claude.ai/new?${new URLSearchParams({
          q: query,
        })}`,
        icon: ClaudeIcon,
      },
    ];

    return options;
  }, [markdownUrl]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="active:scale-none!"
            variant="secondary"
            size="icon-sm"
            aria-label="View Options"
          >
            <ChevronDownIcon className="mt-0.5 size-4" />
          </Button>
        }
      />
      <DropdownMenuContent
        className="w-fit"
        align="end"
        alignOffset={-5}
        finalFocus={false}
      >
        {items.map(({ title, href, icon: Icon }) => (
          <DropdownMenuItem
            key={href}
            render={
              <a href={href} rel="noopener" target="_blank">
                <Icon />
                {title}
              </a>
            }
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LLMCopyButtonGroup({ markdownUrl }: { markdownUrl: string }) {
  return (
    <ButtonGroup>
      <LLMCopyButton markdownUrl={markdownUrl} />
      <ButtonGroupSeparator orientation="vertical" />
      <ViewOptions markdownUrl={markdownUrl} />
    </ButtonGroup>
  );
}
