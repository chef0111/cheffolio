import { expect, test } from 'bun:test';
import { YES_DEFAULTS } from 'create-gb-app/preset';
import { renderToStaticMarkup } from 'react-dom/server';

import { normalizeFlags } from '../lib/compat';
import { CreateProjectSummaryContent } from './create-project-summary';

test('project summary shows the effective architecture and included foundations', () => {
  const html = renderToStaticMarkup(
    <CreateProjectSummaryContent
      flags={YES_DEFAULTS}
      packageManager="bun"
      projectName="my app"
    />
  );
  expect(html).toContain('Your project');
  expect(html).toContain('Single app');
  expect(html).toContain('Next.js');
  expect(html).toContain('shadcn/ui');
  expect(html).toContain('Base UI');
  expect(html).toContain('Zod');
  expect(html).toContain('bun run dev');
});

test('switching the command manager updates all setup commands', () => {
  for (const manager of ['bun', 'pnpm', 'yarn', 'npm'] as const) {
    const html = renderToStaticMarkup(
      <CreateProjectSummaryContent
        flags={YES_DEFAULTS}
        packageManager={manager}
        projectName=""
      />
    );
    expect(html).toContain(`${manager} install`);
    expect(html).toContain(`${manager} run dev`);
    expect(html).toContain('cd my-gb-app');
    if (manager !== 'bun') expect(html).not.toContain('bun run');
  }
});

test('no database or authentication means no irrelevant setup steps', () => {
  const flags = normalizeFlags({
    ...YES_DEFAULTS,
    database: 'none',
    auth: 'none',
    payments: 'none',
  });
  const html = renderToStaticMarkup(
    <CreateProjectSummaryContent
      flags={flags}
      packageManager="pnpm"
      projectName="demo"
    />
  );
  expect(html).not.toContain('Set up your database');
  expect(html).not.toContain('Configure Better Auth');
  expect(html).not.toContain('db:push');
  expect(html).toContain('Setup and next steps');
  expect(html).toContain('aria-expanded="false"');
});

test('the required backend structure and optional fullstack structure use effective selections', () => {
  for (const backend of ['nest', 'hono'] as const) {
    const flags = normalizeFlags({
      ...YES_DEFAULTS,
      backend,
      structure: 'single',
    });
    const html = renderToStaticMarkup(
      <CreateProjectSummaryContent
        flags={flags}
        packageManager="npm"
        projectName="demo"
      />
    );
    expect(html).toContain('Turborepo');
    expect(html).not.toContain('Single app');
  }
  const html = renderToStaticMarkup(
    <CreateProjectSummaryContent
      flags={{ ...YES_DEFAULTS, structure: 'turborepo' }}
      packageManager="npm"
      projectName="demo"
    />
  );
  expect(html).toContain('Turborepo');
  expect(html).toContain('Next.js');
});

test('Convex setup includes its development workflow without relational schema commands', () => {
  const flags = normalizeFlags({ ...YES_DEFAULTS, backend: 'convex' });
  const html = renderToStaticMarkup(
    <CreateProjectSummaryContent
      flags={flags}
      packageManager="yarn"
      projectName="demo"
    />
  );
  expect(html).toContain('Convex');
  expect(html).toContain('yarn run convex:dev');
  expect(html).not.toContain('db:push');
  expect(html).not.toContain('DATABASE_URL');
});

test('summary follows the exclusive form choice without describing an omitted integration', () => {
  const html = renderToStaticMarkup(
    <CreateProjectSummaryContent
      flags={{ ...YES_DEFAULTS, form: 'react-hook-form' }}
      packageManager="bun"
      projectName="demo"
    />
  );
  expect(html).toContain('React Hook Form');
  expect(html).not.toContain('TanStack Form');
});
