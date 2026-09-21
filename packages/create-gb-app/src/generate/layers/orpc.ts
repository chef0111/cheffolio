import { setFile } from "../files";
import type { EmitCtx } from "../types";

export function emitOrpc(ctx: EmitCtx): void {
  ctx.pkg.dependencies["@orpc/server"] = "beta";
  ctx.pkg.dependencies["@orpc/client"] = "beta";
  ctx.pkg.dependencies["@orpc/tanstack-query"] = "beta";
  ctx.pkg.dependencies["@tanstack/react-query"] = "^5.89.0";
  ctx.pkg.dependencies["@tanstack/react-query-next-experimental"] = "^5.89.0";
  ctx.pkg.dependencies.zod = "^4.1.5";

  setFile(
    ctx.files,
    "app/rpc/[[...rest]]/route.ts",
    `import { RPCHandler } from "@orpc/server/fetch";
import { router } from "@/router";

const handler = new RPCHandler(router);

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/rpc",
    context: { headers: request.headers },
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
`,
  );

  setFile(
    ctx.files,
    "lib/orpc.ts",
    `import type { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { router } from "@/router";

const link = new RPCLink({
  origin: typeof window !== "undefined" ? undefined : "http://localhost:3000",
  url: "/rpc",
  headers: async () => {
    if (typeof window !== "undefined") {
      return {};
    }
    const { headers } = await import("next/headers");
    return await headers();
  },
});

export const client: RouterClient<typeof router> = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
`,
  );

  setFile(
    ctx.files,
    "lib/query-client.ts",
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
    "app/providers.tsx",
    `"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { getQueryClient } from "@/lib/query-client";

export function Providers(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
`,
  );
}
