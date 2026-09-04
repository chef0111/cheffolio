'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';

import { useSearchQuery } from '../hooks/use-search-query';

type SearchInputProps = React.ComponentProps<typeof InputGroupInput>;

export function SearchInput({ children, ...props }: SearchInputProps) {
  return (
    <div className="bg-muted/50 dark:bg-muted/20 border-border w-full rounded-xl border p-1.5">
      <InputGroup className="bg-background dark:bg-input/20 h-10 rounded-lg p-0.5 shadow-md ring-transparent!">
        <InputGroupInput
          placeholder="Search blog…"
          className="mx-1"
          {...props}
        />

        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>

        {children}

        <InputGroupAddon align="inline-end" data-slot="search-input-kbd">
          <Kbd className="size-6 rounded-sm!">/</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export function BlogSearchInput() {
  const { query, setQuery } = useSearchQuery();
  const inputRef = React.useRef<HTMLInputElement>(null);

  useHotkeys(
    'slash',
    () => inputRef.current?.focus(),
    { preventDefault: true },
    { enableOnFormTags: true }
  );
  useHotkeys('esc', () => setQuery(null), { enableOnFormTags: true });

  return (
    <SearchInput
      ref={inputRef}
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
      }}
    >
      <InputGroupAddon
        className="pr-2.25 data-[disabled=true]:hidden"
        align="inline-end"
        data-disabled={!query.length}
      >
        <InputGroupButton
          className="rounded-sm border-none"
          size="icon-xs"
          title="Clear"
          aria-label="Clear"
          onClick={() => setQuery(null)}
        >
          <XIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </SearchInput>
  );
}
