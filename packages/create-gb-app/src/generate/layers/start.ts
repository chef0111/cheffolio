import type { Stack } from '#/types/stack';

import type { EmitCtx } from '../../types/generate';
import { setFile } from '../files';

export type StartWebAppOptions = {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  providers: string;
  notesLink: boolean;
};

export function startPassthroughProviders(): string {
  return `import type { ReactNode } from "react";

export function Providers(props: { children: ReactNode }) {
  return props.children;
}
`;
}

export function emitStart(ctx: EmitCtx): void {
  ctx.pkg.scripts.dev = 'vite dev';
  ctx.pkg.scripts.build = 'vite build';
  ctx.pkg.scripts.start = 'vite preview';
  ctx.pkg.dependencies['@tanstack/react-start'] = '^1.132.0';
  ctx.pkg.dependencies['@tanstack/react-router'] = '^1.132.0';
  ctx.pkg.dependencies['@tanstack/react-router-devtools'] = '^1.132.0';
  ctx.pkg.dependencies.react = '^19.1.1';
  ctx.pkg.dependencies['react-dom'] = '^19.1.1';
  ctx.pkg.devDependencies['@tailwindcss/vite'] = '^4.1.13';
  ctx.pkg.devDependencies['@types/node'] = '^24.3.1';
  ctx.pkg.devDependencies['@types/react'] = '^19.1.12';
  ctx.pkg.devDependencies['@types/react-dom'] = '^19.1.9';
  ctx.pkg.devDependencies['@vitejs/plugin-react'] = '^5.0.2';
  ctx.pkg.devDependencies.tailwindcss = '^4.1.13';
  ctx.pkg.devDependencies.typescript = '^5.9.2';
  ctx.pkg.devDependencies.vite = '^7.1.5';
  ctx.pkg.devDependencies['vite-tsconfig-paths'] = '^5.1.4';

  setFile(ctx.files, 'tsconfig.json', startRootTsconfig());
  setFile(ctx.files, 'vite.config.ts', startViteConfig());
  setFile(ctx.files, 'src/styles.css', startStyles());
  setFile(ctx.files, 'src/routes/__root.tsx', startRootRoute(ctx.projectName));
  setFile(
    ctx.files,
    'src/routes/index.tsx',
    startIndexRoute(ctx.projectName, startNotesLink(ctx.stack))
  );
  setFile(
    ctx.files,
    '.gitignore',
    `node_modules
.output
.vinxi
dist
.env
*.log
`
  );
}

export function emitStartWebApp(
  ctx: EmitCtx,
  options: StartWebAppOptions
): void {
  setFile(
    ctx.files,
    'apps/web/package.json',
    JSON.stringify(
      {
        name: 'web',
        version: '0.0.0',
        private: true,
        type: 'module',
        scripts: {
          dev: 'vite dev',
          build: 'vite build',
          start: 'vite preview',
        },
        dependencies: options.dependencies,
        devDependencies: options.devDependencies,
      },
      null,
      2
    )
  );
  setFile(
    ctx.files,
    'apps/web/tsconfig.json',
    JSON.stringify(
      {
        extends: '@repo/typescript-config/base.json',
        compilerOptions: {
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          jsx: 'react-jsx',
          noEmit: true,
          paths: { '@/*': ['./src/*'] },
        },
        include: ['src', 'vite.config.ts'],
      },
      null,
      2
    )
  );
  setFile(ctx.files, 'apps/web/vite.config.ts', startViteConfig());
  setFile(ctx.files, 'apps/web/src/styles.css', startStyles());
  setFile(
    ctx.files,
    'apps/web/src/components/providers.tsx',
    options.providers
  );
  setFile(
    ctx.files,
    'apps/web/src/routes/__root.tsx',
    startRootRoute(ctx.projectName)
  );
  setFile(
    ctx.files,
    'apps/web/src/routes/index.tsx',
    startIndexRoute(ctx.projectName, options.notesLink)
  );
}

function startNotesLink(stack: Stack): boolean {
  switch (stack.backend) {
    case 'convex':
      return true;
    case 'self':
    case 'nest':
    case 'hono':
      return stack.database !== 'none';
    default: {
      const _exhaustive: never = stack;
      throw new Error(`unhandled backend: ${JSON.stringify(_exhaustive)}`);
    }
  }
}

function startRootTsconfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        moduleResolution: 'bundler',
        jsx: 'react-jsx',
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        paths: { '@/*': ['./src/*'] },
      },
      include: ['src', 'vite.config.ts'],
    },
    null,
    2
  );
}

function startViteConfig(): string {
  return `import tailwindcss from "@tailwindcss/vite";
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
`;
}

function startStyles(): string {
  return `@import "tailwindcss";

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
`;
}

function startRootRoute(projectName: string): string {
  return `import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import appCss from "../styles.css?url";
import { Providers } from "../components/providers";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "${projectName}" },
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
`;
}

function startIndexRoute(projectName: string, notesLink: boolean): string {
  return `import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">${projectName}</h1>
      ${
        notesLink
          ? `<p>
        <Link className="underline" to="/notes">
          Open notes
        </Link>
      </p>`
          : ''
      }
    </main>
  );
}
`;
}
