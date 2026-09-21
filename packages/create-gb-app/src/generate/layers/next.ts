import { setFile } from "../files";
import type { EmitCtx } from "../types";

export function emitNext(ctx: EmitCtx): void {
  ctx.pkg.scripts.dev = "next dev";
  ctx.pkg.scripts.build = "next build";
  ctx.pkg.scripts.start = "next start";
  ctx.pkg.dependencies.next = "^15.5.4";
  ctx.pkg.dependencies.react = "^19.1.1";
  ctx.pkg.dependencies["react-dom"] = "^19.1.1";
  ctx.pkg.devDependencies["@types/node"] = "^24.3.1";
  ctx.pkg.devDependencies["@types/react"] = "^19.1.12";
  ctx.pkg.devDependencies["@types/react-dom"] = "^19.1.9";
  ctx.pkg.devDependencies.typescript = "^5.9.2";
  ctx.pkg.devDependencies["@tailwindcss/postcss"] = "^4.1.13";
  ctx.pkg.devDependencies.tailwindcss = "^4.1.13";

  setFile(
    ctx.files,
    "tsconfig.json",
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      },
      null,
      2,
    ),
  );

  setFile(
    ctx.files,
    "next.config.ts",
    `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
`,
  );

  setFile(
    ctx.files,
    "postcss.config.mjs",
    `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`,
  );

  setFile(
    ctx.files,
    "next-env.d.ts",
    `/// <reference types="next" />
/// <reference types="next/image-types/global" />
`,
  );

  setFile(
    ctx.files,
    "app/globals.css",
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
    "app/layout.tsx",
    `import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "${ctx.projectName}",
  description: "Notes app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
`,
  );

  setFile(
    ctx.files,
    "app/page.tsx",
    `import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">${ctx.projectName}</h1>
      <p>
        <Link className="underline" href="/notes">
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
.next
dist
.env
*.log
`,
  );
}
