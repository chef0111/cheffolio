'use client';

import React from 'react';

type CommandMenuContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CommandMenuContext =
  React.createContext<CommandMenuContextValue | null>(null);

export function useCommandMenu() {
  const context = React.use(CommandMenuContext);
  if (!context) {
    throw new Error('CommandMenu must be used within CommandMenuProvider');
  }
  return context;
}

export function CommandMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return (
    <CommandMenuContext.Provider value={value}>
      {children}
    </CommandMenuContext.Provider>
  );
}
