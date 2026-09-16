'use client';

import { parseAsStringLiteral, useQueryStates } from 'nuqs';
import { createContext, type ReactNode, use, useCallback } from 'react';

import { buildCommand } from '../lib/command';
import {
  applyFlagChange,
  isOptionEnabled,
  normalizeFlags,
  YES_DEFAULTS,
} from '../lib/compat';
import { getFolderTree, type TreeNode } from '../lib/tree';
import {
  APIS,
  AUTHS,
  BACKENDS,
  DATABASES,
  DB_SETUPS,
  type FlagGroup,
  FRONTENDS,
  LINTERS,
  ORMS,
  PAYMENTS,
  type StudioFlags,
  UIS,
} from '../types/stack';

type StudioContextValue = {
  flags: StudioFlags;
  setFlag: <K extends FlagGroup>(key: K, value: StudioFlags[K]) => void;
  command: string;
  tree: TreeNode;
};

const StudioContext = createContext<StudioContextValue | null>(null);

const studioSearchParams = {
  frontend: parseAsStringLiteral(FRONTENDS).withDefault(YES_DEFAULTS.frontend),
  backend: parseAsStringLiteral(BACKENDS).withDefault(YES_DEFAULTS.backend),
  api: parseAsStringLiteral(APIS).withDefault(YES_DEFAULTS.api),
  database: parseAsStringLiteral(DATABASES).withDefault(YES_DEFAULTS.database),
  orm: parseAsStringLiteral(ORMS).withDefault(YES_DEFAULTS.orm),
  dbSetup: parseAsStringLiteral(DB_SETUPS).withDefault(YES_DEFAULTS.dbSetup),
  auth: parseAsStringLiteral(AUTHS).withDefault(YES_DEFAULTS.auth),
  payments: parseAsStringLiteral(PAYMENTS).withDefault(YES_DEFAULTS.payments),
  ui: parseAsStringLiteral(UIS).withDefault(YES_DEFAULTS.ui),
  linter: parseAsStringLiteral(LINTERS).withDefault(YES_DEFAULTS.linter),
};

const STUDIO_URL_KEYS = {
  dbSetup: 'db-setup',
} as const;

export function StudioProvider({ children }: { children: ReactNode }) {
  const [rawFlags, setFlags] = useQueryStates(studioSearchParams, {
    history: 'replace',
    urlKeys: STUDIO_URL_KEYS,
  });

  const flags = normalizeFlags(rawFlags);
  const command = buildCommand(flags);
  const tree = getFolderTree(flags);

  const setFlag = useCallback(
    <K extends FlagGroup>(key: K, value: StudioFlags[K]) => {
      void setFlags((current) => {
        const next = normalizeFlags(current);
        if (!isOptionEnabled(next, key, value)) {
          return {};
        }
        return applyFlagChange(next, key, value);
      });
    },
    [setFlags]
  );

  return (
    <StudioContext.Provider value={{ flags, setFlag, command, tree }}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio(): StudioContextValue {
  const value = use(StudioContext);
  if (!value) {
    throw new Error('useStudio must be used within StudioProvider');
  }
  return value;
}
