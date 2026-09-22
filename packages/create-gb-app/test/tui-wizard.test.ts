import { beforeAll, expect, test } from "bun:test";
import { testRender } from "@opentui/react/test-utils";
import { createElement } from "react";
import { App } from "#/tui/app";

beforeAll(async () => {
  const setup = await testRender(createElement(App, { initialFlags: {} }), {
    width: 80,
    height: 24,
  });
  setup.renderer.destroy();
});

test("wizard first frame shows Backend and blocks Polar when auth is none", async () => {
  const started = performance.now();
  const setup = await testRender(
    createElement(App, { initialFlags: { auth: "none", payments: "none" } }),
    { width: 80, height: 24 },
  );
  try {
    await setup.renderOnce();
    const firstFrameMs = performance.now() - started;
    expect(firstFrameMs).toBeLessThan(250);
    const frame = setup.captureCharFrame();
    expect(frame).toContain("Backend");
    expect(frame).toContain("Polar unavailable");
    expect(frame).not.toMatch(/\bPolar\b(?! unavailable)/);
  } finally {
    setup.renderer.destroy();
  }
});

test("Nest selection preview lists packages/contract", async () => {
  const setup = await testRender(
    createElement(App, { initialFlags: { backend: "nest" } }),
    { width: 80, height: 24 },
  );
  try {
    await setup.renderOnce();
    const frame = setup.captureCharFrame();
    expect(frame).toContain("packages/contract");
    expect(frame).toContain("--backend nest");
  } finally {
    setup.renderer.destroy();
  }
});

test("Convex hides api and database", async () => {
  const setup = await testRender(
    createElement(App, { initialFlags: { backend: "convex" } }),
    { width: 80, height: 24 },
  );
  try {
    await setup.renderOnce();
    const frame = setup.captureCharFrame();
    expect(frame).toContain("convex");
    expect(frame).toContain("API and database hidden");
    expect(frame).not.toContain("apps/server");
  } finally {
    setup.renderer.destroy();
  }
});

test("Start plus tRPC preview lists src/routes", async () => {
  const setup = await testRender(
    createElement(App, {
      initialFlags: {
        frontend: "tanstack-start",
        backend: "self",
        api: "trpc",
        auth: "none",
        linter: "oxlint",
      },
    }),
    { width: 80, height: 24 },
  );
  try {
    await setup.renderOnce();
    const frame = setup.captureCharFrame();
    expect(frame).toContain("src/routes");
    expect(frame).toContain("--frontend tanstack-start");
    expect(frame).toContain("--api trpc");
  } finally {
    setup.renderer.destroy();
  }
});

test("argv database sqlite survives in the command preview", async () => {
  const setup = await testRender(
    createElement(App, { initialFlags: { database: "sqlite" } }),
    { width: 80, height: 24 },
  );
  try {
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain("--database sqlite");
  } finally {
    setup.renderer.destroy();
  }
});

test("40x12 still shows the full command preview", async () => {
  const setup = await testRender(
    createElement(App, { initialFlags: { auth: "none" } }),
    { width: 40, height: 12 },
  );
  try {
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain("create-gb-app my-gb-app");
  } finally {
    setup.renderer.destroy();
  }
});
