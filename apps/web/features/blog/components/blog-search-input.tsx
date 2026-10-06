'use client';

import { XIcon } from 'lucide-react';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';

import { useSearchQuery } from '../hooks/use-search-query';
import { BlogTagFilter, type BlogTagOption } from './blog-tag-filter';
import { SearchInput } from './search-input';

export function BlogSearchInput({ tags }: { tags: BlogTagOption[] }) {
  const { query, setQuery } = useSearchQuery();
  const inputRef = React.useRef<HTMLInputElement>(null);

  useHotkeys(
    'slash',
    () => inputRef.current?.focus(),
    { preventDefault: true },
    { enableOnFormTags: true }
  );
  useHotkeys(
    'esc',
    (event) => {
      if (event.target === inputRef.current) setQuery(null);
    },
    { enableOnFormTags: true }
  );

  return (
    <SearchInput
      ref={inputRef}
      aria-label="Search blog"
      filter={<BlogTagFilter options={tags} />}
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
