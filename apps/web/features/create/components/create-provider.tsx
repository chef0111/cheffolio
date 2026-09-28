'use client';

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
import { parseAsStringLiteral, useQueryStates } from 'nuqs';
import { createContext, type ReactNode, use, useCallback } from 'react';

import { useProjectName } from '../hooks/use-project-name';
import { buildCommand } from '../lib/command';
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
  previewProjectName: string;
  setProjectName: (name: string) => void;
  command: string;
};

const CreateContext = createContext<CreateContextValue | null>(null);

const createSearchParams = {
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
  const [rawFlags, setParams] = useQueryStates(createSearchParams, {
    history: 'replace',
    urlKeys: CREATE_URL_KEYS,
  });
  const {
    projectName,
    previewProjectName,
    setProjectName: setName,
  } = useProjectName();

  const flags = normalizeFlags(rawFlags);
  const command = buildCommand(flags, projectName);

  const setFlag = useCallback(
    <K extends FlagGroup>(key: K, value: CreateFlags[K]) => {
      void setParams((current) => {
        const next = normalizeFlags(current);
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
      void setName(name);
    },
    [setName]
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
        previewProjectName,
        setProjectName,
        command,
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
