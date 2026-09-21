import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { testRender } from "@opentui/react/test-utils";
import { createElement } from "react";
import { App } from "../src/tui/app.tsx";
import type { RawFlags } from "../src/stack/types.ts";

const media = join(import.meta.dir, "..", "media");
mkdirSync(media, { recursive: true });

async function capture(name: string, flags: RawFlags, size = { width: 80, height: 24 }) {
  const setup = await testRender(createElement(App, { initialFlags: flags }), size);
  try {
    await setup.renderOnce();
    const frame = setup.captureCharFrame();
    writeFileSync(join(media, `${name}.txt`), frame, "utf8");
    return frame;
  } finally {
    setup.renderer.destroy();
  }
}

await capture("gb-3-review-frame", { auth: "none", payments: "none" });
await capture("gb-3-review-nest-tree", { backend: "nest" });
await capture("gb-3-review-convex", { backend: "convex" });
await capture("gb-3-review-resize", { auth: "none" }, { width: 40, height: 12 });
console.log("wrote media/*.txt");
