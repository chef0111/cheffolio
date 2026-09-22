import type { CreateFlags, FlagGroup } from 'create-gb-app/preset';
import type { ComponentType } from 'react';

import {
  BetterAuthIcon,
  BiomeIcon,
  ClerkIcon,
  ConvexIcon,
  DockerIcon,
  DrizzleIcon,
  EslintIcon,
  MysqlIcon,
  NeonIcon,
  NestIcon,
  NextIcon,
  OrpcIcon,
  OxlintIcon,
  PolarIcon,
  PostgresIcon,
  PrismaIcon,
  SqliteIcon,
  StripeIcon,
  SupabaseIcon,
  TanStackStartIcon,
  TrpcIcon,
} from '@/components/icons';
import type { IconProps } from '@/components/icons/type';

export const FLAG_GROUP_LABELS: Record<FlagGroup, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  api: 'API',
  database: 'Database',
  orm: 'ORM',
  dbSetup: 'Database setup',
  auth: 'Auth',
  payments: 'Payments',
  linter: 'Linter',
};

export type FlagOption<K extends FlagGroup> = {
  value: CreateFlags[K];
  label: string;
  description: string;
  icon?: ComponentType<IconProps>;
};

export const FLAG_OPTIONS: { [K in FlagGroup]: readonly FlagOption<K>[] } = {
  frontend: [
    {
      value: 'next',
      label: 'Next.js',
      description: 'The React framework for the web by Vercel',
      icon: NextIcon,
    },
    {
      value: 'tanstack-start',
      label: 'TanStack Start',
      description: 'Full-stack React framework by TanStack',
      icon: TanStackStartIcon,
    },
  ],
  backend: [
    {
      value: 'self',
      label: 'Fullstack Next.js',
      description: 'Next.js built-in API routes & server actions',
      icon: NextIcon,
    },
    {
      value: 'nest',
      label: 'Nest',
      description: 'A progressive Node.js framework',
      icon: NestIcon,
    },
    {
      value: 'convex',
      label: 'Convex',
      description: 'Reactive backend-as-a-service',
      icon: ConvexIcon,
    },
  ],
  api: [
    {
      value: 'orpc',
      label: 'oRPC',
      description: 'Type-safe APIs made simple',
      icon: OrpcIcon,
    },
    {
      value: 'trpc',
      label: 'tRPC',
      description: 'End-to-end type-safe APIs',
      icon: TrpcIcon,
    },
    {
      value: 'none',
      label: 'None',
      description: 'No RPC layer',
    },
  ],
  database: [
    {
      value: 'postgres',
      label: 'PostgreSQL',
      description: 'Advanced Open Source Relational Database',
      icon: PostgresIcon,
    },
    {
      value: 'sqlite',
      label: 'SQLite',
      description: 'Small, fast, and reliable embedded database',
      icon: SqliteIcon,
    },
    {
      value: 'mysql',
      label: 'MySQL',
      description: 'Relational SQL',
      icon: MysqlIcon,
    },
    {
      value: 'none',
      label: 'None',
      description: 'No database',
    },
  ],
  orm: [
    {
      value: 'prisma',
      label: 'Prisma',
      description: 'Typed ORM',
      icon: PrismaIcon,
    },
    {
      value: 'drizzle',
      label: 'Drizzle',
      description: 'SQL-first ORM',
      icon: DrizzleIcon,
    },
    {
      value: 'none',
      label: 'None',
      description: 'No ORM',
    },
  ],
  dbSetup: [
    {
      value: 'none',
      label: 'None',
      description: 'Skip hosted DB',
    },
    {
      value: 'docker',
      label: 'Docker',
      description: 'Local Compose',
      icon: DockerIcon,
    },
    {
      value: 'neon',
      label: 'Neon',
      description: 'Serverless Postgres',
      icon: NeonIcon,
    },
    {
      value: 'supabase',
      label: 'Supabase',
      description: 'Hosted Postgres',
      icon: SupabaseIcon,
    },
  ],
  auth: [
    {
      value: 'better-auth',
      label: 'Better Auth',
      description: 'TypeScript auth',
      icon: BetterAuthIcon,
    },
    {
      value: 'clerk',
      label: 'Clerk',
      description: 'Hosted auth',
      icon: ClerkIcon,
    },
    {
      value: 'none',
      label: 'None',
      description: 'No sign-in',
    },
  ],
  payments: [
    {
      value: 'none',
      label: 'None',
      description: 'No billing',
    },
    {
      value: 'stripe',
      label: 'Stripe',
      description: 'Payments API',
      icon: StripeIcon,
    },
    {
      value: 'polar',
      label: 'Polar',
      description: 'OSS billing',
      icon: PolarIcon,
    },
  ],
  linter: [
    {
      value: 'eslint',
      label: 'ESLint',
      description: 'JS linter',
      icon: EslintIcon,
    },
    {
      value: 'biome',
      label: 'Biome',
      description: 'Fast toolchain',
      icon: BiomeIcon,
    },
    {
      value: 'oxlint',
      label: 'Oxlint',
      description: 'Rust linter',
      icon: OxlintIcon,
    },
  ],
};

export function presentFlagOption<K extends FlagGroup>(
  option: FlagOption<K>,
  flags: CreateFlags
): FlagOption<K> {
  if (option.value !== 'self') {
    return option;
  }

  return {
    ...option,
    ...fullstackBackendCopy(flags.frontend),
  };
}

export function fullstackBackendCopy(frontend: CreateFlags['frontend']): {
  label: string;
  description: string;
  icon: ComponentType<IconProps>;
} {
  switch (frontend) {
    case 'next':
      return {
        label: 'Fullstack Next.js',
        description: 'Next.js built-in API routes & server actions',
        icon: NextIcon,
      };
    case 'tanstack-start':
      return {
        label: 'Fullstack TanStack Start',
        description: 'TanStack Start built-in API routes & server functions',
        icon: TanStackStartIcon,
      };
    default: {
      const _exhaustive: never = frontend;
      throw new Error(`unhandled frontend: ${_exhaustive}`);
    }
  }
}
