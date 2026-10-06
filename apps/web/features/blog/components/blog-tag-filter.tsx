'use client';

import { ListFilterIcon, XIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

import { useTagFilter } from '../hooks/use-tag-filter';

export type BlogTagOption = {
  tag: string;
  count: number;
};

export function BlogTagFilter({ options }: { options: BlogTagOption[] }) {
  const { tags, setTags } = useTagFilter();
  const counts = new Map(options.map(({ tag, count }) => [tag, count]));

  return (
    <Combobox
      multiple
      items={options.map(({ tag }) => tag)}
      value={tags}
      onValueChange={(value) => setTags(value)}
    >
      <ComboboxTrigger
        render={
          <Button
            variant="outline"
            size="xs"
            className={cn(
              'has-data-[icon=inline-start]:ps mr-0.75 h-6 rounded-sm px-1.5 transition-colors active:scale-none! has-data-[icon=inline-end]:pe-1',
              tags.length === 0 && 'w-6 pe-1.5'
            )}
          />
        }
        aria-label={
          tags.length > 0
            ? `Filter by tags, ${tags.length} selected`
            : 'Filter by tags'
        }
        showChevron={false}
      >
        <ListFilterIcon data-icon="inline-start" />
        {tags.length > 0 && (
          <Badge
            variant="secondary"
            data-icon="inline-end"
            className="bg-input/70 h-4 px-1.5"
          >
            {tags.length}
          </Badge>
        )}
      </ComboboxTrigger>
      <ComboboxContent
        align="end"
        className="max-w-56 min-w-48"
        onClick={(event) => event.stopPropagation()}
      >
        <ComboboxInput
          placeholder="Search tags…"
          aria-label="Search tags"
          showTrigger={false}
        />
        <ComboboxEmpty>No tags found.</ComboboxEmpty>
        <ComboboxList>
          {(tag: string) => (
            <ComboboxItem key={tag} value={tag}>
              {tag}
              <Badge
                variant="secondary"
                className="bg-input/70 ms-auto h-4 px-1.5"
              >
                {counts.get(tag)}
              </Badge>
            </ComboboxItem>
          )}
        </ComboboxList>
        {tags.length > 0 && (
          <>
            <ComboboxSeparator />
            <div className="p-1 pt-0">
              <Button
                variant="ghost"
                size="xs"
                className="w-full justify-between"
                onClick={() => setTags(null)}
              >
                Clear filters
                <XIcon />
              </Button>
            </div>
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
