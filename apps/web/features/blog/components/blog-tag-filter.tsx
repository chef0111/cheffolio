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
            variant="ghost"
            size="xs"
            className={cn(
              'mr-px rounded-sm',
              tags.length === 0 && 'size-7 pe-1.5'
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
        className="w-56"
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
