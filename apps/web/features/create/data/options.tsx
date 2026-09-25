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
  HonoIcon,
  MySql,
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
  api: 'API layer',
  database: 'Database',
  orm: 'ORM',
  dbSetup: 'Database setup',
  auth: 'Authentication',
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
      description: 'Reactive backend-as-a-service with TypeScript',
      icon: ConvexIcon,
    },
    {
      value: 'hono',
      label: 'Hono',
      description: 'Web framework built on Web Standards',
      icon: HonoIcon,
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
      description: 'Advanced open-source Relational Database',
      icon: PostgresIcon,
    },
    {
      value: 'sqlite',
      label: 'SQLite',
      description: 'Small, fast, and reliable Embedded Database',
      icon: SqliteIcon,
    },
    {
      value: 'mysql',
      label: 'MySQL',
      description: 'Most popular open-source Relational Database',
      icon: MySql,
    },
    {
      value: 'none',
      label: 'None',
      description: 'No database integration',
    },
  ],
  orm: [
    {
      value: 'prisma',
      label: 'Prisma',
      description: 'Type-safe ORM for TypeScript and Node.js',
      icon: PrismaIcon,
    },
    {
      value: 'drizzle',
      label: 'Drizzle',
      description: 'Next gen headless TypeScript ORM',
      icon: DrizzleIcon,
    },
  ],
  dbSetup: [
    {
      value: 'none',
      label: 'None',
      description: 'Skip hosted database setup',
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
      description: 'Open-source comprehensive authentication framework',
      icon: BetterAuthIcon,
    },
    {
      value: 'clerk',
      label: 'Clerk',
      description: 'Authentication and User Management service',
      icon: ClerkIcon,
    },
    {
      value: 'none',
      label: 'None',
      description: 'No authentication setup',
    },
  ],
  payments: [
    {
      value: 'none',
      label: 'None',
      description: 'No payment integration',
    },
    {
      value: 'stripe',
      label: 'Stripe',
      description: 'Global payment processing platform',
      icon: StripeIcon,
    },
    {
      value: 'polar',
      label: 'Polar',
      description: 'Billing platform for intelligence era',
      icon: PolarIcon,
    },
  ],
  linter: [
    {
      value: 'eslint',
      label: 'ESLint',
      description: 'Most well-known JavaScript linter',
      icon: EslintIcon,
    },
    {
      value: 'biome',
      label: 'Biome',
      description: 'One toolchain for your web project',
      icon: BiomeIcon,
    },
    {
      value: 'oxlint',
      label: 'Oxlint',
      description: 'High-performance linter for JS and TS',
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
