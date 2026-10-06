'use client';

import { parseAsNativeArrayOf, parseAsString, useQueryState } from 'nuqs';

export function useTagFilter() {
  const [tags, setTags] = useQueryState(
    'tags',
    parseAsNativeArrayOf(parseAsString)
  );

  return { tags, setTags };
}
