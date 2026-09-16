import { setFile } from "../files.ts";
import { isStart } from "../paths.ts";
import type { EmitCtx } from "../types.ts";

export function emitClerk(ctx: EmitCtx): void {
  if (ctx.stack.backend === "convex") {
    ctx.pkg.dependencies["@clerk/clerk-react"] = "^5.46.1";
    ctx.pkg.dependencies["convex"] = ctx.pkg.dependencies.convex ?? "^1.27.0";
    emitStartClerkConvexProviders(ctx);
    return;
  }

  if (ctx.stack.backend === "nest") {
    throw new Error("nest clerk generate is not implemented yet");
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
