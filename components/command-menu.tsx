import { Button } from '@/components/ui/button';
import { KbdGroup, Kbd } from '@/components/ui/kbd';
import { Search } from 'lucide-react';

function CommandMenu() {
  return (
    <>
      <CommandMenuTrigger />
    </>
  );
}

function CommandMenuTrigger({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="command-menu-trigger"
      className="text-muted-foreground hover:bg-background hover:text-muted-foreground dark:hover:bg-input/30 gap-1.5 rounded-full shadow-none select-none"
      variant="outline"
      size="sm"
      {...props}
    >
      <Search />

      <span className="font-sans text-sm/4 font-medium sm:hidden">Search…</span>

      <KbdGroup className="hidden sm:in-[.os-macos_&]:flex">
        <Kbd className="w-5 min-w-5">⌘</Kbd>
        <Kbd className="w-5 min-w-5">K</Kbd>
      </KbdGroup>

      <KbdGroup className="hidden sm:not-[.os-macos_&]:flex">
        <Kbd>Ctrl</Kbd>
        <Kbd className="w-5 min-w-5">K</Kbd>
      </KbdGroup>
    </Button>
  );
}

export { CommandMenu, CommandMenuTrigger };
