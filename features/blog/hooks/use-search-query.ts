import { debounce, useQueryState } from 'nuqs';

export function useSearchQuery() {
  const [query, setQuery] = useQueryState('q', {
    defaultValue: '',
    limitUrlUpdates: debounce(300),
  });

  return { query, setQuery };
}
