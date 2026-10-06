'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

export function useTagFilter() {
  const [tags, setTags] = useQueryState(
    'tags',
    parseAsArrayOf(parseAsString, ',').withDefault([])
  );

  return { tags, setTags };
}
