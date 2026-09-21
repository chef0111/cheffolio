import { setFile } from "../files";
import type { EmitCtx } from "../types";

export function emitStart(ctx: EmitCtx): void {
  ctx.pkg.scripts.dev = "vite dev";
  ctx.pkg.scripts.build = "vite build";
  ctx.pkg.scripts.start = "vite preview";
  ctx.pkg.dependencies["@tanstack/react-start"] = "^1.132.0";
  ctx.pkg.dependencies["@tanstack/react-router"] = "^1.132.0";
  ctx.pkg.dependencies["@tanstack/react-router-devtools"] = "^1.132.0";
  ctx.pkg.dependencies.react = "^19.1.1";
  ctx.pkg.dependencies["react-dom"] = "^19.1.1";
  ctx.pkg.devDependencies["@tailwindcss/vite"] = "^4.1.13";
  ctx.pkg.devDependencies["@types/node"] = "^24.3.1";
  ctx.pkg.devDependencies["@types/react"] = "^19.1.12";
  ctx.pkg.devDependencies["@types/react-dom"] = "^19.1.9";
  ctx.pkg.devDependencies["@vitejs/plugin-react"] = "^5.0.2";
  ctx.pkg.devDependencies.tailwindcss = "^4.1.13";
  ctx.pkg.devDependencies.typescript = "^5.9.2";
  ctx.pkg.devDependencies.vite = "^7.1.5";
  ctx.pkg.devDependencies["vite-tsconfig-paths"] = "^5.1.4";

  setFile(
    ctx.files,
    "tsconfig.json",
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          paths: { "@/*": ["./src/*"] },
        },
        include: ["src", "vite.config.ts"],
      },
      null,
      2,
    ),
  );

  setFile(
    ctx.files,
    "vite.config.ts",
    `import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
});
`,
  );

  setFile(
    ctx.files,
    "src/styles.css",
    `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
}
`,
  );

  setFile(
    ctx.files,
    "src/routes/__root.tsx",
    `import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import appCss from "../styles.css?url";
import { Providers } from "../components/providers";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "${ctx.projectName}" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          <Outlet />
        </Providers>
        <TanStackRouterDevtools />
        <Scripts />
      </body>
    </html>
  );
}
`,
  );

  setFile(
    ctx.files,
    "src/routes/index.tsx",
    `import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">${ctx.projectName}</h1>
      <p>
        <Link className="underline" to="/notes">
          Open notes
        </Link>
      </p>
    </main>
  );
}
`,
  );

  setFile(
    ctx.files,
    ".gitignore",
    `node_modules
.output
.vinxi
dist
.env
*.log
`,
  );
}
