import type { FlagGroup, StudioFlags } from '../types/stack';

export const FLAG_GROUP_LABELS: Record<FlagGroup, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  api: 'API',
  database: 'Database',
  orm: 'ORM',
  dbSetup: 'Database setup',
  auth: 'Auth',
  payments: 'Payments',
  ui: 'UI',
  linter: 'Linter',
};

type FlagOption<K extends FlagGroup> = {
  value: StudioFlags[K];
  label: string;
};

export const FLAG_OPTIONS: { [K in FlagGroup]: readonly FlagOption<K>[] } = {
  frontend: [
    { value: 'next', label: 'Next' },
    { value: 'tanstack-start', label: 'TanStack Start' },
  ],
  backend: [
    { value: 'self', label: 'Self' },
    { value: 'nest', label: 'Nest' },
    { value: 'convex', label: 'Convex' },
  ],
  api: [
    { value: 'orpc', label: 'oRPC' },
    { value: 'trpc', label: 'tRPC' },
  ],
  database: [
    { value: 'postgres', label: 'Postgres' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'mysql', label: 'MySQL' },
  ],
  orm: [
    { value: 'prisma', label: 'Prisma' },
    { value: 'drizzle', label: 'Drizzle' },
  ],
  dbSetup: [
    { value: 'none', label: 'None' },
    { value: 'docker', label: 'Docker' },
    { value: 'neon', label: 'Neon' },
    { value: 'supabase', label: 'Supabase' },
  ],
  auth: [
    { value: 'none', label: 'None' },
    { value: 'better-auth', label: 'Better Auth' },
    { value: 'clerk', label: 'Clerk' },
  ],
  payments: [
    { value: 'none', label: 'None' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'polar', label: 'Polar' },
  ],
  ui: [
    { value: 'shadcn', label: 'shadcn' },
    { value: 'none', label: 'None' },
  ],
  linter: [
    { value: 'eslint', label: 'ESLint' },
    { value: 'biome', label: 'Biome' },
    { value: 'oxlint', label: 'Oxlint' },
  ],
};
