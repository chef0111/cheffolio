import { createElement } from "react";
import type { RawFlags } from "../stack/types";
import { runWizardGenerate } from "./run-generate";

export async function mountWizard(initialFlags: RawFlags): Promise<void> {
  const { createCliRenderer } = await import("@opentui/core");
  const { createRoot } = await import("@opentui/react");
  const { App } = await import("./app");

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
        try {
          await runWizardGenerate(flags);
        } finally {
          shutdown();
        }
      },
    }),
  );
}
