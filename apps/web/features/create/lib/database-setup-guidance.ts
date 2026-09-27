import {
  PACKAGE_MANAGER_METADATA,
  type PackageManager,
} from 'create-gb-app/generate';
import type { CreateFlags } from 'create-gb-app/preset';

export type SetupStep = {
  title: string;
  description?: string;
  commands?: readonly string[];
};

export function getDatabaseSetupGuidance(
  flags: CreateFlags,
  packageManager: PackageManager
): SetupStep[] {
  if (flags.backend === 'convex' || flags.database === 'none') return [];
  const owner =
    flags.structure === 'single'
      ? ''
      : flags.backend === 'self'
        ? 'apps/web/'
        : 'apps/server/';
  const run = PACKAGE_MANAGER_METADATA[packageManager].run;
  const commands: string[] = [];
  if (flags.dbSetup === 'docker') commands.push('docker compose up -d');
  if (flags.orm === 'prisma') commands.push(`${run} db:generate`);
  let description = `Set DATABASE_URL in ${owner}.env, then create the schema.`;
  if (flags.dbSetup === 'turso') {
    description = `Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in ${owner}.env.`;
    if (flags.orm === 'prisma') {
      description +=
        ' Keep LOCAL_DATABASE_URL for local SQLite migrations. Review and apply each migration SQL once with the Turso CLI as explained in the generated README.';
      commands.push(`${run} db:migrate`);
    } else {
      commands.push(`${run} db:generate`, `${run} db:migrate`);
    }
  } else {
    if (flags.dbSetup === 'planetscale' && flags.database === 'mysql') {
      description +=
        ' Use a development branch with foreign keys enabled; promote schema changes through a PlanetScale deploy request.';
    } else if (
      flags.dbSetup === 'planetscale' ||
      flags.dbSetup === 'prisma-postgres'
    ) {
      description = `Set the pooled DATABASE_URL and direct DIRECT_URL in ${owner}.env, preserving provider TLS settings. Schema tools use the direct connection.`;
    }
    commands.push(`${run} db:push`);
  }
  description += ' Run this sequence from the project root.';
  return [{ title: 'Set up your database', description, commands }];
}
