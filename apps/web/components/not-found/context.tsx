'use client';

import React from 'react';

export interface NotFoundGameState {
  cleared: boolean;
}

export interface NotFoundGameActions {
  restart: () => void;
}

export interface NotFoundGameContextValue {
  state: NotFoundGameState;
  actions: NotFoundGameActions;
}

export const NotFoundGameContext =
  React.createContext<NotFoundGameContextValue | null>(null);

export function useNotFoundGame() {
  const context = React.useContext(NotFoundGameContext);
  if (!context) {
    throw new Error('useNotFoundGame must be used within NotFound');
  }
  return context;
}
