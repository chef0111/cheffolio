'use client';

import type { PackageManager } from 'create-gb-app/generate';
import {
  APIS,
  AUTHS,
  BACKENDS,
  type CreateFlags,
  DATABASES,
  DB_SETUPS,
  type FlagGroup,
  FORMS,
  FRONTENDS,
  LINTERS,
  ORMS,
  PAYMENTS,
  PROJECT_STRUCTURES,
  YES_DEFAULTS,
} from 'create-gb-app/preset';
import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { createContext, type ReactNode, use, useCallback } from 'react';

import { usePackageManager } from '@/components/cheffolio/code-block-command';

import { buildCommand, DEFAULT_PROJECT_NAME } from '../lib/command';
import {
  applyFlagChange,
  isOptionEnabled,
  normalizeFlags,
} from '../lib/compat';

type CreateContextValue = {
  flags: CreateFlags;
  setFlag: <K extends FlagGroup>(key: K, value: CreateFlags[K]) => void;
  setFlags: (flags: CreateFlags) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  command: string;
  packageManager: PackageManager;
};

const CreateContext = createContext<CreateContextValue | null>(null);

const createSearchParams = {
  name: parseAsString.withDefault(DEFAULT_PROJECT_NAME),
  frontend: parseAsStringLiteral(FRONTENDS).withDefault(YES_DEFAULTS.frontend),
  backend: parseAsStringLiteral(BACKENDS).withDefault(YES_DEFAULTS.backend),
  structure: parseAsStringLiteral(PROJECT_STRUCTURES).withDefault(
    YES_DEFAULTS.structure
  ),
  api: parseAsStringLiteral(APIS).withDefault(YES_DEFAULTS.api),
  database: parseAsStringLiteral(DATABASES).withDefault(YES_DEFAULTS.database),
  orm: parseAsStringLiteral(ORMS).withDefault(YES_DEFAULTS.orm),
  dbSetup: parseAsStringLiteral(DB_SETUPS).withDefault(YES_DEFAULTS.dbSetup),
  auth: parseAsStringLiteral(AUTHS).withDefault(YES_DEFAULTS.auth),
  payments: parseAsStringLiteral(PAYMENTS).withDefault(YES_DEFAULTS.payments),
  linter: parseAsStringLiteral(LINTERS).withDefault(YES_DEFAULTS.linter),
  form: parseAsStringLiteral(FORMS).withDefault(YES_DEFAULTS.form),
};

const CREATE_URL_KEYS = {
  dbSetup: 'db-setup',
} as const;

export function CreateProvider({ children }: { children: ReactNode }) {
  const [selectedManager] = usePackageManager();
  const packageManager = selectedManager === 'prompt' ? 'bun' : selectedManager;
  const [params, setParams] = useQueryStates(createSearchParams, {
    history: 'replace',
    urlKeys: CREATE_URL_KEYS,
  });

  const { name: projectName, ...rawFlags } = params;
  const flags = normalizeFlags(rawFlags);
  const command = buildCommand(flags, projectName);

  const setFlag = useCallback(
    <K extends FlagGroup>(key: K, value: CreateFlags[K]) => {
      void setParams((current) => {
        const { name, ...currentFlags } = current;
        void name;
        const next = normalizeFlags(currentFlags);
        if (!isOptionEnabled(next, key, value)) {
          return {};
        }
        return applyFlagChange(next, key, value);
      });
    },
    [setParams]
  );

  const setProjectName = useCallback(
    (name: string) => {
      void setParams({ name });
    },
    [setParams]
  );

  const setFlags = useCallback(
    (next: CreateFlags) => {
      void setParams(normalizeFlags(next));
    },
    [setParams]
  );

  return (
    <CreateContext.Provider
      value={{
        flags,
        setFlag,
        setFlags,
        projectName,
        setProjectName,
        command,
        packageManager,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
}

export function useCreate(): CreateContextValue {
  const value = use(CreateContext);
  if (!value) {
    throw new Error('useCreate must be used within CreateProvider');
  }
  return value;
}
