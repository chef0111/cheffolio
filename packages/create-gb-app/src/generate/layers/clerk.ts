import { setFile } from "#/generate/files";
import { isStart } from "#/generate/paths";
import type { EmitCtx } from "#/generate/types";

export function emitClerk(ctx: EmitCtx): void {
  if (ctx.stack.backend === "convex") {
    ctx.pkg.dependencies["@clerk/clerk-react"] = "^5.46.1";
    ctx.pkg.dependencies["convex"] = ctx.pkg.dependencies.convex ?? "^1.27.0";
    emitStartClerkConvexProviders(ctx);
    return;
  }

  if (ctx.stack.backend === "nest") {
    emitNestClerk(ctx);
    return;
  }

  if (isStart(ctx.stack) && ctx.stack.backend === "self") {
    ctx.pkg.dependencies["@clerk/tanstack-react-start"] = "^0.25.0";
    return;
  }

  ctx.pkg.dependencies["@clerk/nextjs"] = "^6.31.5";
  setFile(
    ctx.files,
    "middleware.ts",
    `import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
`,
  );
}

function emitNestClerk(ctx: EmitCtx): void {
  ctx.pkg.dependencies["@clerk/express"] = "^1.7.19";
  const serverPkgPath = "apps/server/package.json";
  const serverPkgRaw = ctx.files[serverPkgPath];
  if (serverPkgRaw) {
    const serverPkg = JSON.parse(serverPkgRaw) as {
      dependencies: Record<string, string>;
    };
    serverPkg.dependencies["@clerk/express"] = "^1.7.19";
    delete serverPkg.dependencies["@thallesp/nestjs-better-auth"];
    delete serverPkg.dependencies["better-auth"];
    setFile(ctx.files, serverPkgPath, `${JSON.stringify(serverPkg, null, 2)}\n`);
  }

  setFile(
    ctx.files,
    "apps/server/src/clerk.ts",
    `import { clerkMiddleware, getAuth } from "@clerk/express";
import type { Request } from "express";

export { clerkMiddleware, getAuth };

export function clerkUserId(request: Request) {
  return getAuth(request).userId;
}
`,
  );

  setFile(
    ctx.files,
    "apps/server/src/main.ts",
    `import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { clerkMiddleware } from "@clerk/express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(clerkMiddleware());
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  await app.listen(3333);
}

void bootstrap();
`,
  );

  if (ctx.stack.backend === "nest" && ctx.stack.api !== "orpc") {
    return;
  }

  setFile(
    ctx.files,
    "apps/server/src/app.module.ts",
    `import { type ExecutionContext, Module } from "@nestjs/common";
import { ORPCModule } from "@orpc/nest";
import type { Request } from "express";
import { NotesController } from "./notes.controller";

@Module({
  imports: [
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
    "apps/server/src/notes.controller.ts",
    `import { Controller } from "@nestjs/common";
import { Implement } from "@orpc/nest";
import { ORPCError, implement } from "@orpc/server";
import { contract } from "@repo/contract";
import type { Request } from "express";
import { getAuth } from "@clerk/express";
import { prisma } from "./db";

function requireUserId(request: Request) {
  const userId = getAuth(request).userId;
  if (!userId) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return userId;
}

@Controller()
export class NotesController {
  @Implement(contract.me)
  me() {
    return implement(contract.me)
      .$context<{ request: Request }>()
      .handler(async ({ context }) => {
        return { id: requireUserId(context.request) };
      });
  }

  @Implement(contract.notes.list)
  list() {
    return implement(contract.notes.list)
      .$context<{ request: Request }>()
      .handler(async ({ context }) => {
        const userId = requireUserId(context.request);
        return prisma.note.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });
      });
  }

  @Implement(contract.notes.create)
  create() {
    return implement(contract.notes.create)
      .$context<{ request: Request }>()
      .handler(async ({ input, context }) => {
        const userId = requireUserId(context.request);
        return prisma.note.create({
          data: {
            title: input.title,
            body: input.body,
            userId,
          },
        });
      });
  }

  @Implement(contract.notes.update)
  update() {
    return implement(contract.notes.update)
      .$context<{ request: Request }>()
      .handler(async ({ input, context }) => {
        const userId = requireUserId(context.request);
        const note = await prisma.note.findFirst({
          where: { id: input.id, userId },
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
        const userId = requireUserId(context.request);
        const note = await prisma.note.findFirst({
          where: { id: input.id, userId },
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

function emitStartClerkConvexProviders(ctx: EmitCtx): void {
  setFile(
    ctx.files,
    "src/components/providers.tsx",
    `"use client";

import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type { ReactNode } from "react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export function Providers(props: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {props.children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
`,
  );
}
