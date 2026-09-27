import {
  PACKAGE_MANAGER_METADATA,
  type PackageManager,
  SHADCN_FOUNDATION,
} from 'create-gb-app/generate';
import type { CreateFlags, FlagGroup } from 'create-gb-app/preset';

import { FLAG_OPTIONS } from '../data/options';
import { resolveProjectName } from './command';
import {
  getDatabaseSetupGuidance,
  type SetupStep,
} from './database-setup-guidance';

function optionLabel<K extends FlagGroup>(
  flags: CreateFlags,
  group: K
): string {
  return (
    FLAG_OPTIONS[group].find((option) => option.value === flags[group])
      ?.label ?? flags[group]
  );
}

function quoteDirectory(value: string): string {
  return /^[A-Za-z0-9._-]+$/.test(value)
    ? value
    : `'${value.replaceAll("'", `'\\''`)}'`;
}

export function getProjectSummary(
  flags: CreateFlags,
  packageManager: PackageManager,
  projectName: string
) {
  const manager = PACKAGE_MANAGER_METADATA[packageManager];
  const tools = [optionLabel(flags, 'frontend')];
  if (flags.backend !== 'self') tools.push(optionLabel(flags, 'backend'));
  if (flags.api !== 'none') tools.push(optionLabel(flags, 'api'));
  if (flags.database !== 'none')
    tools.push(
      `${optionLabel(flags, 'database')} with ${optionLabel(flags, 'orm')}`
    );
  if (flags.auth !== 'none') tools.push(optionLabel(flags, 'auth'));
  if (flags.payments !== 'none') tools.push(optionLabel(flags, 'payments'));
  if (flags.form && flags.form !== 'none')
    tools.push(optionLabel(flags, 'form'));

  const steps: SetupStep[] = [
    {
      title: 'Open your project',
      description: `Use ${packageManager} ${manager.version}. Install dependencies if you skipped installation during creation.`,
      commands: [
        `cd ${quoteDirectory(resolveProjectName(projectName))}`,
        manager.install,
      ],
    },
    ...getDatabaseSetupGuidance(flags, packageManager),
  ];

  if (flags.auth !== 'none')
    steps.push({
      title: `Configure ${optionLabel(flags, 'auth')}`,
      description:
        flags.auth === 'clerk'
          ? 'Add your Clerk publishable and secret keys to the generated environment files. Follow the generated README for the frontend and backend configuration.'
          : flags.backend === 'convex'
            ? 'Follow the generated README to connect Better Auth to your Convex deployment.'
            : 'Replace the development BETTER_AUTH_SECRET and set BETTER_AUTH_URL to your application URL in the generated environment file.',
    });

  if (flags.payments !== 'none')
    steps.push({
      title: `Configure ${optionLabel(flags, 'payments')}`,
      description:
        'Replace the payment credentials and webhook placeholders in the generated environment file before using payments.',
    });

  steps.push({
    title: 'Start developing',
    description:
      flags.backend === 'convex'
        ? 'Connect your Convex deployment using the generated README. Keep the Convex development command running alongside the frontend.'
        : 'Run from the project root after completing the relevant setup above.',
    commands:
      flags.backend === 'convex'
        ? [`${manager.run} convex:dev`, `${manager.run} dev`]
        : [`${manager.run} dev`],
  });

  return {
    structure: optionLabel(flags, 'structure'),
    architecture:
      flags.structure === 'turborepo'
        ? 'Applications and shared packages in one workspace.'
        : 'One fullstack application at the project root.',
    tools,
    foundations: [
      'shadcn/ui',
      ...(SHADCN_FOUNDATION.base === 'base' ? ['Base UI'] : []),
      'Zod',
    ],
    steps,
  };
}
