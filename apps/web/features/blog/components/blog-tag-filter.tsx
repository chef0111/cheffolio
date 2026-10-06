'use client';

import { ListFilterIcon } from 'lucide-react';

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
        render={<Button variant="ghost" size="xs" />}
        aria-label={
          tags.length > 0
            ? `Filter by tags, ${tags.length} selected`
            : 'Filter by tags'
        }
      >
        <ListFilterIcon data-icon="inline-start" />
        Filter
        {tags.length > 0 && <Badge variant="secondary">{tags.length}</Badge>}
      </ComboboxTrigger>
      <ComboboxContent
        align="end"
        className="w-64"
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
              <Badge variant="secondary" className="ms-auto">
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
                className="w-full"
                onClick={() => setTags(null)}
              >
                Clear filters
              </Button>
            </div>
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
