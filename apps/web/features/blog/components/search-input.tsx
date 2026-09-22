import { SearchIcon } from 'lucide-react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';

type SearchInputProps = React.ComponentProps<typeof InputGroupInput>;

export function SearchInput({ children, ...props }: SearchInputProps) {
  return (
    <div className="bg-muted/50 dark:bg-muted/20 border-border w-full rounded-xl border p-1.5">
      <InputGroup className="bg-background dark:bg-input/20 h-10 rounded-lg shadow-md ring-transparent!">
        <InputGroupInput placeholder="Search blog…" {...props} />

        <InputGroupAddon align="inline-start" className="mx-0.5">
          <SearchIcon />
        </InputGroupAddon>

        {children}

        <InputGroupAddon align="inline-end" data-slot="search-input-kbd">
          <Kbd className="mr-px size-6 rounded-sm!">/</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
