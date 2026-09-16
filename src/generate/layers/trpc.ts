import { setFile } from "../files.ts";
import type { EmitCtx } from "../types.ts";

export function emitTrpc(ctx: EmitCtx): void {
  ctx.pkg.dependencies["@trpc/server"] = "^11.5.1";
  ctx.pkg.dependencies["@trpc/client"] = "^11.5.1";
  ctx.pkg.dependencies["@trpc/react-query"] = "^11.5.1";
  ctx.pkg.dependencies["@tanstack/react-query"] = "^5.89.0";
  ctx.pkg.dependencies.zod = "^4.1.5";
  ctx.pkg.dependencies.superjson = "^2.2.2";

  setFile(
    ctx.files,
    "src/server/trpc.ts",
    `import { initTRPC } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
`,
  );

  setFile(
    ctx.files,
    "src/routes/api/trpc.$.ts",
    `import { createFileRoute } from "@tanstack/react-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/router";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async () => ({}),
  });
}

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
`,
  );

  setFile(
    ctx.files,
    "src/lib/trpc.ts",
    `import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/router";

export const trpc = createTRPCReact<AppRouter>();
`,
  );

  setFile(
    ctx.files,
    "src/lib/query-client.ts",
    `import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
`,
  );

  setFile(
    ctx.files,
    "src/components/providers.tsx",
    `"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState, type ReactNode } from "react";
import superjson from "superjson";
import { getQueryClient } from "../lib/query-client";
import { trpc } from "../lib/trpc";

export function Providers(props: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
`,
  );
}
