import { GenerateError } from "../errors";
import { workspaceProtocol } from "../workspace-protocol";
import { setFile } from "../files";
import type { EmitCtx } from "../types";
import { emitBiome } from "./biome";
import { emitDbSetup } from "./db-setup";
import { emitDrizzle } from "./drizzle";
import { emitPostgres } from "./postgres";
import { emitPrisma } from "./prisma";

function proto(ctx: EmitCtx): string {
  return workspaceProtocol(ctx.packageManager);
}

export function emitNest(ctx: EmitCtx): void {
  if (ctx.stack.backend !== "nest") {
    throw new Error("emitNest requires nest");
  }
  if (ctx.stack.frontend !== "next") {
    throw new GenerateError(
      "nest-start",
      "nest Start generate is not implemented yet",
    );
  }

  const dep = proto(ctx);
  ctx.pkg.private = true;
  ctx.pkg.scripts.dev = "turbo dev";
  ctx.pkg.scripts.build = "turbo build";
  ctx.pkg.scripts.lint = "turbo lint";
  ctx.pkg.devDependencies.turbo = "^2.5.6";
  ctx.pkg.devDependencies.typescript = "^5.9.2";
  ctx.pkg.workspaces = ["apps/*", "packages/*"];

  emitPostgres(ctx);
  switch (ctx.stack.orm) {
    case "prisma":
      emitPrisma(ctx);
      break;
    case "drizzle":
      emitDrizzle(ctx);
      break;
    default: {
      const _exhaustive: never = ctx.stack.orm;
      throw new Error(`unhandled orm: ${_exhaustive}`);
    }
  }
  emitDbSetup(ctx);

  setFile(
    ctx.files,
    "turbo.json",
    JSON.stringify(
      {
        $schema: "https://turborepo.dev/schema.json",
        tasks: {
          build: {
            dependsOn: ["^build"],
            outputs: ["dist/**", ".next/**", "!.next/cache/**"],
          },
          dev: { cache: false, persistent: true },
          lint: { dependsOn: ["^lint"] },
        },
      },
      null,
      2,
    ),
  );

  emitTypescriptConfig(ctx, dep);
  emitContract(ctx, dep);
  if (ctx.stack.ui === "shadcn") {
    emitUiPackage(ctx, dep);
  }
  emitServer(ctx, dep);
  emitWeb(ctx, dep);

  switch (ctx.stack.linter) {
    case "biome":
      emitBiome(ctx);
      break;
    case "eslint":
      throw new GenerateError(
        "nest-eslint",
        "nest eslint generate is not implemented yet",
      );
    case "oxlint":
      throw new GenerateError(
        "nest-oxlint",
        "nest oxlint generate is not implemented yet",
      );
    default: {
      const _exhaustive: never = ctx.stack.linter;
      throw new Error(`unhandled linter: ${_exhaustive}`);
    }
  }
}

function emitTypescriptConfig(ctx: EmitCtx, _dep: string): void {
  setFile(
    ctx.files,
    "packages/typescript-config/package.json",
    JSON.stringify(
      {
        name: "@repo/typescript-config",
        version: "0.0.0",
        private: true,
        files: ["base.json"],
      },
      null,
      2,
    ),
  );
  setFile(
    ctx.files,
    "packages/typescript-config/base.json",
    JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "bundler",
          skipLibCheck: true,
        },
      },
      null,
      2,
    ),
  );
}

function emitContract(ctx: EmitCtx, dep: string): void {
  setFile(
    ctx.files,
    "packages/contract/package.json",
    JSON.stringify(
      {
        name: "@repo/contract",
        version: "0.0.0",
        private: true,
        type: "module",
        exports: { ".": "./src/index.ts" },
        dependencies: {
          "@orpc/contract": "beta",
          "@orpc/openapi": "beta",
          zod: "^4.1.5",
        },
        devDependencies: {
          "@repo/typescript-config": dep,
        },
      },
      null,
      2,
    ),
  );

  setFile(
    ctx.files,
    "packages/contract/src/index.ts",
    `export { contract } from "./contract";
`,
  );

  setFile(
    ctx.files,
    "packages/contract/src/contract.ts",
    `import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
});

const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const contract = {
  me: oc
    .meta(openapi({ method: "GET", path: "/me" }))
    .output(UserSchema),
  notes: {
    list: oc
      .meta(openapi({ method: "GET", path: "/notes" }))
      .output(z.array(NoteSchema)),
    create: oc
      .meta(openapi({ method: "POST", path: "/notes" }))
      .input(z.object({ title: z.string().min(1), body: z.string() }))
      .output(NoteSchema),
    update: oc
      .meta(openapi({ method: "PATCH", path: "/notes/{id}" }))
      .input(
        z.object({
          id: z.string(),
          title: z.string().min(1),
          body: z.string(),
        }),
      )
      .output(NoteSchema),
    delete: oc
      .meta(openapi({ method: "DELETE", path: "/notes/{id}" }))
      .input(z.object({ id: z.string() }))
      .output(z.object({ ok: z.literal(true) })),
  },
};
`,
  );
}

function emitUiPackage(ctx: EmitCtx, dep: string): void {
  setFile(
    ctx.files,
    "packages/ui/package.json",
    JSON.stringify(
      {
        name: "@repo/ui",
        version: "0.0.0",
        private: true,
        type: "module",
        exports: {
          "./button": "./src/button.tsx",
          "./input": "./src/input.tsx",
          "./card": "./src/card.tsx",
          "./utils": "./src/utils.ts",
        },
        dependencies: {
          clsx: "^2.1.1",
          "tailwind-merge": "^3.3.1",
          react: "^19.1.1",
        },
        devDependencies: {
          "@repo/typescript-config": dep,
          "@types/react": "^19.1.12",
        },
      },
      null,
      2,
    ),
  );
  setFile(
    ctx.files,
    "packages/ui/src/utils.ts",
    `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
  );
  setFile(
    ctx.files,
    "packages/ui/src/button.tsx",
    `import type { ButtonHTMLAttributes } from "react";
import { cn } from "./utils";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-3 text-sm font-medium text-white disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
`,
  );
  setFile(
    ctx.files,
    "packages/ui/src/input.tsx",
    `import type { InputHTMLAttributes } from "react";
import { cn } from "./utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border border-neutral-300 bg-transparent px-3 text-sm",
        className,
      )}
      {...props}
    />
  );
}
`,
  );
  setFile(
    ctx.files,
    "packages/ui/src/card.tsx",
    `import type { HTMLAttributes } from "react";
import { cn } from "./utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-neutral-200 bg-white p-4", className)}
      {...props}
    />
  );
}
`,
  );
}

function emitServer(ctx: EmitCtx, dep: string): void {
  setFile(
    ctx.files,
    "apps/server/package.json",
    JSON.stringify(
      {
        name: "server",
        version: "0.0.0",
        private: true,
        type: "module",
        scripts: {
          dev: "tsx watch src/main.ts",
          start: "node dist/main.js",
          build: "tsc",
        },
        dependencies: {
          "@nestjs/common": "^11.1.6",
          "@nestjs/core": "^11.1.6",
          "@nestjs/platform-express": "^11.1.6",
          "@orpc/nest": "beta",
          "@orpc/openapi": "beta",
          "@orpc/server": "beta",
          "@prisma/client": "^6.16.1",
          "@repo/contract": dep,
          "@thallesp/nestjs-better-auth": "^2.2.0",
          "better-auth": "^1.3.8",
          "reflect-metadata": "^0.2.2",
          rxjs: "^7.8.2",
        },
        devDependencies: {
          "@repo/typescript-config": dep,
          "@types/express": "^5.0.3",
          "@types/node": "^24.3.1",
          prisma: "^6.16.1",
          tsx: "^4.20.5",
          typescript: "^5.9.2",
        },
      },
      null,
      2,
    ),
  );

  setFile(
    ctx.files,
    "apps/server/src/main.ts",
    `import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  await app.listen(3333);
}

void bootstrap();
`,
  );

  setFile(
    ctx.files,
    "apps/server/src/app.module.ts",
    `import { type ExecutionContext, Module } from "@nestjs/common";
import { ORPCModule } from "@orpc/nest";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import type { Request } from "express";
import { auth } from "./auth";
import { NotesController } from "./notes.controller";

@Module({
  imports: [
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: "2mb" },
        urlencoded: { limit: "2mb", extended: true },
      },
    }),
    ORPCModule.forRoot({
      context: (ctx: object) => ({
        request: (ctx as ExecutionContext).switchToHttp().getRequest<Request>(),
      }),
    }),
  ],
  controllers: [NotesController],
})
export class AppModule {}
`,
  );

  setFile(
    ctx.files,
    "apps/server/src/auth.ts",
    `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  trustedOrigins: ["http://localhost:3000"],
});
`,
  );

  setFile(
    ctx.files,
    "apps/server/src/notes.controller.ts",
    `import { Controller } from "@nestjs/common";
import { Implement } from "@orpc/nest";
import { ORPCError, implement } from "@orpc/server";
import { contract } from "@repo/contract";
import { fromNodeHeaders } from "better-auth/node";
import type { Request } from "express";
import { auth } from "./auth";
import { prisma } from "./db";

@Controller()
export class NotesController {
  @Implement(contract.me)
  me() {
    return implement(contract.me)
      .$context<{ request: Request }>()
      .handler(async ({ context }) => {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(context.request.headers),
        });
        if (!session) {
          throw new ORPCError("UNAUTHORIZED");
        }
        return session.user;
      });
  }

  @Implement(contract.notes.list)
  list() {
    return implement(contract.notes.list)
      .$context<{ request: Request }>()
      .handler(async ({ context }) => {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(context.request.headers),
        });
        if (!session) {
          throw new ORPCError("UNAUTHORIZED");
        }
        return prisma.note.findMany({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
        });
      });
  }

  @Implement(contract.notes.create)
  create() {
    return implement(contract.notes.create)
      .$context<{ request: Request }>()
      .handler(async ({ input, context }) => {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(context.request.headers),
        });
        if (!session) {
          throw new ORPCError("UNAUTHORIZED");
        }
        return prisma.note.create({
          data: {
            title: input.title,
            body: input.body,
            userId: session.user.id,
          },
        });
      });
  }

  @Implement(contract.notes.update)
  update() {
    return implement(contract.notes.update)
      .$context<{ request: Request }>()
      .handler(async ({ input, context }) => {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(context.request.headers),
        });
        if (!session) {
          throw new ORPCError("UNAUTHORIZED");
        }
        const note = await prisma.note.findFirst({
          where: { id: input.id, userId: session.user.id },
        });
        if (!note) {
          throw new ORPCError("NOT_FOUND");
        }
        return prisma.note.update({
          where: { id: note.id },
          data: { title: input.title, body: input.body },
        });
      });
  }

  @Implement(contract.notes.delete)
  remove() {
    return implement(contract.notes.delete)
      .$context<{ request: Request }>()
      .handler(async ({ input, context }) => {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(context.request.headers),
        });
        if (!session) {
          throw new ORPCError("UNAUTHORIZED");
        }
        const note = await prisma.note.findFirst({
          where: { id: input.id, userId: session.user.id },
        });
        if (!note) {
          throw new ORPCError("NOT_FOUND");
        }
        await prisma.note.delete({ where: { id: note.id } });
        return { ok: true as const };
      });
  }
}
`,
  );
}

function emitWeb(ctx: EmitCtx, dep: string): void {
  const uiDeps =
    ctx.stack.ui === "shadcn"
      ? { "@repo/ui": dep }
      : {};

  setFile(
    ctx.files,
    "apps/web/package.json",
    JSON.stringify(
      {
        name: "web",
        version: "0.0.0",
        private: true,
        type: "module",
        scripts: {
          dev: "next dev --port 3000",
          build: "next build",
          start: "next start",
        },
        dependencies: {
          "@orpc/client": "beta",
          "@orpc/contract": "beta",
          "@orpc/openapi": "beta",
          "@orpc/tanstack-query": "beta",
          "@repo/contract": dep,
          ...uiDeps,
          "@tanstack/react-query": "^5.89.0",
          "@tanstack/react-query-next-experimental": "^5.89.0",
          "better-auth": "^1.3.8",
          next: "^15.5.4",
          react: "^19.1.1",
          "react-dom": "^19.1.1",
          "server-only": "^0.0.1",
        },
        devDependencies: {
          "@repo/typescript-config": dep,
          "@tailwindcss/postcss": "^4.1.13",
          "@types/node": "^24.3.1",
          "@types/react": "^19.1.12",
          "@types/react-dom": "^19.1.9",
          tailwindcss: "^4.1.13",
          typescript: "^5.9.2",
        },
      },
      null,
      2,
    ),
  );

  setFile(
    ctx.files,
    "apps/web/next.config.ts",
    `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
`,
  );

  setFile(
    ctx.files,
    "apps/web/app/globals.css",
    `@import "tailwindcss";
`,
  );

  setFile(
    ctx.files,
    "apps/web/app/layout.tsx",
    `import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = { title: "${ctx.projectName}" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
    "apps/web/app/page.tsx",
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
    "apps/web/lib/orpc-link.ts",
    `import { OpenAPILink } from "@orpc/openapi/fetch";
import { contract } from "@repo/contract";

export function createOrpcLink(getHeaders?: () => Promise<Record<string, string>>) {
  return new OpenAPILink(contract, {
    url: process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3333",
    fetch: (url, init) =>
      globalThis.fetch(url, {
        ...init,
        credentials: "include",
      }),
    ...(getHeaders ? { headers: getHeaders } : {}),
  });
}
`,
  );

  setFile(
    ctx.files,
    "apps/web/lib/orpc.ts",
    `"use client";

import { createORPCClient } from "@orpc/client";
import type { RouterContractClient } from "@orpc/contract";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { contract } from "@repo/contract";
import { createOrpcLink } from "./orpc-link";

export const client: RouterContractClient<typeof contract> = createORPCClient(
  createOrpcLink(),
);

export const orpc = createTanstackQueryUtils(client);
`,
  );

  setFile(
    ctx.files,
    "apps/web/lib/orpc.server.ts",
    `import "server-only";

import { createORPCClient } from "@orpc/client";
import type { RouterContractClient } from "@orpc/contract";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { contract } from "@repo/contract";
import { headers } from "next/headers";
import { createOrpcLink } from "./orpc-link";

export const client: RouterContractClient<typeof contract> = createORPCClient(
  createOrpcLink(async () => {
    const incoming = await headers();
    const cookie = incoming.get("cookie");
    return cookie ? { cookie } : {};
  }),
);

export const orpc = createTanstackQueryUtils(client);
`,
  );

  setFile(
    ctx.files,
    "apps/web/lib/query-client.ts",
    `import { QueryClient } from "@tanstack/react-query";

export function getQueryClient() {
  return new QueryClient();
}
`,
  );

  setFile(
    ctx.files,
    "apps/web/app/providers.tsx",
    `"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

export function Providers(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
`,
  );

  setFile(
    ctx.files,
    "apps/web/lib/auth-client.ts",
    `import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3333",
});
`,
  );

  const buttonImport =
    ctx.stack.ui === "shadcn"
      ? `import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Input } from "@repo/ui/input";`
      : "";

  const formControls =
    ctx.stack.ui === "shadcn"
      ? `<Input name="title" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <Input name="body" placeholder="Body" value={body} onChange={(event) => setBody(event.target.value)} />
        <Button type="submit" disabled={create.isPending}>Add note</Button>`
      : `<input name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <input name="body" value={body} onChange={(event) => setBody(event.target.value)} />
        <button type="submit" disabled={create.isPending}>Add note</button>`;

  const noteItem =
    ctx.stack.ui === "shadcn"
      ? `<Card className="p-4">
              <h2 className="font-medium">{note.title}</h2>
              <p className="text-sm opacity-80">{note.body}</p>
            </Card>`
      : `<article>
              <h2>{note.title}</h2>
              <p>{note.body}</p>
            </article>`;

  setFile(
    ctx.files,
    "apps/web/app/notes/notes-client.tsx",
    `"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
${buttonImport}

export function NotesClient() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const notes = useQuery(orpc.notes.list.queryOptions());
  const create = useMutation(
    orpc.notes.create.mutationOptions({
      onSuccess: async () => {
        setTitle("");
        setBody("");
        await queryClient.invalidateQueries();
      },
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          create.mutate({ title, body });
        }}
      >
        ${formControls}
      </form>
      <ul className="flex flex-col gap-3">
        {(notes.data ?? []).map((note) => (
          <li key={note.id}>
            ${noteItem}
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
  );

  setFile(
    ctx.files,
    "apps/web/app/notes/page.tsx",
    `import Link from "next/link";
import { NotesClient } from "./notes-client";

export default function NotesPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <Link className="text-sm underline" href="/login">
          Login
        </Link>
      </div>
      <NotesClient />
    </main>
  );
}
`,
  );

  setFile(
    ctx.files,
    "apps/web/app/login/page.tsx",
    `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result =
      mode === "signup"
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password });
    if (result.error) {
      return;
    }
    router.push("/notes");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-8">
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        {mode === "signup" ? (
          <input name="name" value={name} onChange={(event) => setName(event.target.value)} required />
        ) : null}
        <input name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <input name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button type="submit">{mode === "signin" ? "Sign in" : "Sign up"}</button>
      </form>
    </main>
  );
}
`,
  );
}
