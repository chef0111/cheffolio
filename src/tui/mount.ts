import { createElement } from "react";
import type { RawFlags } from "../stack/types.ts";
import { inferPackageManager } from "../cli/package-manager.ts";
import { generateApp } from "../generate/run.ts";
import { resolveStack } from "../stack/resolve.ts";

export async function mountWizard(initialFlags: RawFlags): Promise<void> {
  const { createCliRenderer } = await import("@opentui/core");
  const { createRoot } = await import("@opentui/react");
  const { App } = await import("./app.tsx");

  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    screenMode: "alternate-screen",
  });

  let shuttingDown = false;
  const shutdown = () => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    renderer.destroy();
  };

  const root = createRoot(renderer);
  root.render(
    createElement(App, {
      initialFlags,
      onExit: shutdown,
      onGenerate: async (flags: RawFlags) => {
        const dest = flags.projectName ?? "my-app";
        const stack = resolveStack(flags);
        try {
          const result = await generateApp({
            dest,
            stack,
            flags: { ...flags, projectName: dest },
            packageManager: inferPackageManager(),
          });
          process.stdout.write(
            `done: wrote ${result.fileCount} files to ${result.dest}\n`,
          );
        } finally {
          shutdown();
        }
      },
    }),
  );
}
