import {
  AppWindowIcon,
  CircleOffIcon,
  CloudIcon,
  CreditCardIcon,
  CylinderIcon,
  GaugeIcon,
  HardDriveIcon,
  KeyRoundIcon,
  LeafIcon,
  ShieldIcon,
  SquareCheckIcon,
  TriangleIcon,
  WaypointsIcon,
  ZapIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';

import { DockerIcon } from '@/components/icons/docker';
import { DrizzleIcon } from '@/components/icons/drizzle';
import { NestIcon } from '@/components/icons/nest';
import { NextIcon } from '@/components/icons/next';
import { OrpcIcon } from '@/components/icons/orpc';
import { PostgresIcon } from '@/components/icons/postgres';
import { PrismaIcon } from '@/components/icons/prisma';
import { ShadcnIcon } from '@/components/icons/shadcn';
import { TanStackStartIcon } from '@/components/icons/tanstack-start';
import type { IconProps } from '@/components/icons/type';

import type { CreateFlags, FlagGroup } from '../types/stack';

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

export type FlagOption<K extends FlagGroup> = {
  value: CreateFlags[K];
  label: string;
  description: string;
  icon: ComponentType<IconProps>;
};

export const FLAG_OPTIONS: { [K in FlagGroup]: readonly FlagOption<K>[] } = {
  frontend: [
    {
      value: 'next',
      label: 'Next',
      description: 'Next.js App Router',
      icon: NextIcon,
    },
    {
      value: 'tanstack-start',
      label: 'TanStack Start',
      description: 'TanStack Start',
      icon: TanStackStartIcon,
    },
  ],
  backend: [
    {
      value: 'self',
      label: 'Self',
      description: 'API in the same app',
      icon: AppWindowIcon,
    },
    {
      value: 'nest',
      label: 'Nest',
      description: 'apps/web, apps/server, packages/contract',
      icon: NestIcon,
    },
    {
      value: 'convex',
      label: 'Convex',
      description: 'convex/ directory',
      icon: CloudIcon,
    },
  ],
  api: [
    {
      value: 'orpc',
      label: 'oRPC',
      description: 'Router-first procedures',
      icon: OrpcIcon,
    },
    {
      value: 'trpc',
      label: 'tRPC',
      description: 'Router type from this app',
      icon: WaypointsIcon,
    },
  ],
  database: [
    {
      value: 'postgres',
      label: 'Postgres',
      description: 'PostgreSQL',
      icon: PostgresIcon,
    },
    {
      value: 'sqlite',
      label: 'SQLite',
      description: 'SQLite file',
      icon: HardDriveIcon,
    },
    {
      value: 'mysql',
      label: 'MySQL',
      description: 'MySQL',
      icon: CylinderIcon,
    },
  ],
  orm: [
    {
      value: 'prisma',
      label: 'Prisma',
      description: 'Prisma schema and client',
      icon: PrismaIcon,
    },
    {
      value: 'drizzle',
      label: 'Drizzle',
      description: 'Drizzle ORM',
      icon: DrizzleIcon,
    },
  ],
  dbSetup: [
    {
      value: 'none',
      label: 'None',
      description: 'Skip hosted setup',
      icon: CircleOffIcon,
    },
    {
      value: 'docker',
      label: 'Docker',
      description: 'docker-compose.yml',
      icon: DockerIcon,
    },
    {
      value: 'neon',
      label: 'Neon',
      description: 'Neon Postgres',
      icon: ZapIcon,
    },
    {
      value: 'supabase',
      label: 'Supabase',
      description: 'Supabase Postgres',
      icon: TriangleIcon,
    },
  ],
  auth: [
    {
      value: 'none',
      label: 'None',
      description: 'Public notes',
      icon: CircleOffIcon,
    },
    {
      value: 'better-auth',
      label: 'Better Auth',
      description: 'Email and password',
      icon: KeyRoundIcon,
    },
    {
      value: 'clerk',
      label: 'Clerk',
      description: 'Hosted auth',
      icon: ShieldIcon,
    },
  ],
  payments: [
    {
      value: 'none',
      label: 'None',
      description: 'No billing',
      icon: CircleOffIcon,
    },
    {
      value: 'stripe',
      label: 'Stripe',
      description: 'Checkout and portal',
      icon: CreditCardIcon,
    },
    {
      value: 'polar',
      label: 'Polar',
      description: 'Polar checkout',
      icon: ZapIcon,
    },
  ],
  ui: [
    {
      value: 'shadcn',
      label: 'shadcn',
      description: 'shadcn/ui',
      icon: ShadcnIcon,
    },
    {
      value: 'none',
      label: 'None',
      description: 'No component library',
      icon: CircleOffIcon,
    },
  ],
  linter: [
    {
      value: 'eslint',
      label: 'ESLint',
      description: 'ESLint',
      icon: SquareCheckIcon,
    },
    {
      value: 'biome',
      label: 'Biome',
      description: 'Biome',
      icon: LeafIcon,
    },
    {
      value: 'oxlint',
      label: 'Oxlint',
      description: 'Oxlint',
      icon: GaugeIcon,
    },
  ],
};
