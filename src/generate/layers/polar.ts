import { setFile } from "../files.ts";
import { isStart } from "../paths.ts";
import type { EmitCtx } from "../types.ts";

const POLAR_PLUGIN = `polar({
      createCustomerOnSignUp: true,
      products: [{ slug: "pro", name: "Pro" }],
    })`;

export function emitPolar(ctx: EmitCtx): void {
  ctx.pkg.dependencies["@polar-sh/better-auth"] = "^1.4.0";
  const portalPath = isStart(ctx.stack)
    ? "src/routes/portal.tsx"
    : ctx.stack.backend === "nest"
      ? "apps/web/app/portal/page.tsx"
      : "app/portal/page.tsx";
  setFile(
    ctx.files,
    portalPath,
    `export default function PortalPage() {
  return (
    <main>
      <h1>Polar portal</h1>
      <p>Product: pro</p>
    </main>
  );
}
`,
  );
  const authPath =
    ctx.stack.backend === "nest"
      ? "apps/server/src/auth.ts"
      : isStart(ctx.stack)
        ? "src/lib/auth.ts"
        : "lib/auth.ts";
  const current = ctx.files[authPath] ?? "";
  if (!current || current.includes("@polar-sh/better-auth")) {
    return;
  }
  setFile(ctx.files, authPath, injectPolarPlugin(current));
}

function injectPolarPlugin(source: string): string {
  let next = source.includes('from "@polar-sh/better-auth"')
    ? source
    : source.replace(
        'from "better-auth";',
        `from "better-auth";
import { polar } from "@polar-sh/better-auth";`,
      );

  if (next.includes("plugins: [")) {
    return next.replace("plugins: [", `plugins: [\n    ${POLAR_PLUGIN}, `);
  }

  return next.replace(
    "betterAuth({",
    `betterAuth({
  plugins: [
    ${POLAR_PLUGIN},
  ],`,
  );
}
