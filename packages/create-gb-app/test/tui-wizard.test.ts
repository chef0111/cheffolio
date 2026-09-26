import { testRender } from '@opentui/react/test-utils';
import { beforeAll, expect, test } from 'bun:test';
import { act, createElement } from 'react';

import { App } from '#/tui/app';

beforeAll(async () => {
  const setup = await testRender(createElement(App, { initialFlags: {} }), {
    width: 80,
    height: 24,
  });
  setup.renderer.destroy();
});

for (const backend of ['self', 'convex'] as const) {
  test(`${backend} can choose Turborepo with the keyboard and return to single app`, async () => {
    const setup = await testRender(
      createElement(App, { initialFlags: { backend } }),
      { width: 100, height: 40 }
    );
    try {
      await setup.renderOnce();
      const first = setup.captureCharFrame();
      expect(first).toContain('Single app');
      expect(first).toContain('Turborepo');
      expect(first).not.toContain('coming later');
      expect(first).not.toContain('--structure turborepo');
      await act(async () => setup.mockInput.pressTab());
      await setup.renderOnce();
      await act(async () => setup.mockInput.pressArrow('down'));
      await setup.renderOnce();
      expect(setup.captureCharFrame()).toContain('--structure turborepo');
      expect(setup.captureCharFrame()).toContain('apps/web');
      await act(async () => setup.mockInput.pressArrow('up'));
      await setup.renderOnce();
      expect(setup.captureCharFrame()).not.toContain('--structure turborepo');
    } finally {
      setup.renderer.destroy();
    }
  });
}

for (const backend of ['nest', 'hono'] as const) {
  test(`${backend} keeps Turborepo required when the structure control is used`, async () => {
    const setup = await testRender(
      createElement(App, { initialFlags: { backend } }),
      { width: 100, height: 40 }
    );
    try {
      await setup.renderOnce();
      await act(async () => setup.mockInput.pressTab());
      await setup.renderOnce();
      await act(async () => setup.mockInput.pressArrow('up'));
      await setup.renderOnce();
      const frame = setup.captureCharFrame();
      expect(frame).toContain('Nest/Hono need Turborepo');
      expect(frame).toContain('--structure turborepo');
      expect(frame).not.toContain('Single app');
    } finally {
      setup.renderer.destroy();
    }
  });
}

test('wizard first frame shows Backend and blocks Polar when auth is none', async () => {
  const started = performance.now();
  const setup = await testRender(
    createElement(App, { initialFlags: { auth: 'none', payments: 'none' } }),
    { width: 80, height: 24 }
  );
  try {
    await setup.renderOnce();
    const firstFrameMs = performance.now() - started;
    expect(firstFrameMs).toBeLessThan(250);
    const frame = setup.captureCharFrame();
    expect(frame).toContain('Backend');
    expect(frame).toContain('Polar unavailable');
    expect(frame).not.toMatch(/\bPolar\b(?! unavailable)/);
  } finally {
    setup.renderer.destroy();
  }
});

test('Nest selection preview lists packages/contract', async () => {
  const setup = await testRender(
    createElement(App, { initialFlags: { backend: 'nest' } }),
    { width: 80, height: 24 }
  );
  try {
    await setup.renderOnce();
    const frame = setup.captureCharFrame();
    expect(frame).toContain('packages/contract');
    expect(frame).toContain('--backend nest');
    expect(frame).toContain('Project structure');
    expect(frame).toContain('Nest/Hono need Turborepo');
  } finally {
    setup.renderer.destroy();
  }
});

test('Convex hides api and database', async () => {
  const setup = await testRender(
    createElement(App, { initialFlags: { backend: 'convex' } }),
    { width: 80, height: 24 }
  );
  try {
    await setup.renderOnce();
    const frame = setup.captureCharFrame();
    expect(frame).toContain('convex');
    expect(frame).toContain('API and database hidden');
    expect(frame).not.toContain('apps/server');
  } finally {
    setup.renderer.destroy();
  }
});

test('Start plus tRPC preview lists src/routes', async () => {
  const setup = await testRender(
    createElement(App, {
      initialFlags: {
        frontend: 'tanstack-start',
        backend: 'self',
        api: 'trpc',
        auth: 'none',
        linter: 'oxlint',
      },
    }),
    { width: 80, height: 24 }
  );
  try {
    await setup.renderOnce();
    const frame = setup.captureCharFrame();
    expect(frame).toContain('src/routes');
    expect(frame).toContain('--frontend tanstack-start');
    expect(frame).toContain('--api trpc');
  } finally {
    setup.renderer.destroy();
  }
});

test('argv database sqlite survives in the command preview', async () => {
  const setup = await testRender(
    createElement(App, { initialFlags: { database: 'sqlite' } }),
    { width: 80, height: 24 }
  );
  try {
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain('--database sqlite');
  } finally {
    setup.renderer.destroy();
  }
});

test('40x12 still shows the full command preview', async () => {
  const setup = await testRender(
    createElement(App, { initialFlags: { auth: 'none' } }),
    { width: 40, height: 12 }
  );
  try {
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain('create-gb-app my-gb-app');
  } finally {
    setup.renderer.destroy();
  }
});
