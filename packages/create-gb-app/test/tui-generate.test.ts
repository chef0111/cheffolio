import { expect, test } from "bun:test";
import { runWizardGenerate } from "#/tui/run-generate";

test("wizard generate reports CompatError instead of rejecting", async () => {
  const stderr = process.stderr.write;
  const chunks: string[] = [];
  process.stderr.write = ((chunk: string | Uint8Array) => {
    chunks.push(typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk));
    return true;
  }) as typeof process.stderr.write;
  try {
    await runWizardGenerate({ backend: "nest", api: "trpc" });
    expect(process.exitCode).toBe(1);
    expect(chunks.join("")).toContain("error:");
    expect(chunks.join("")).toContain("nest trpc generate is not implemented yet");
  } finally {
    process.stderr.write = stderr;
    process.exitCode = 0;
  }
});
