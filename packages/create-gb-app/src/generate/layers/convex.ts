import { setFile } from "../files.ts";
import type { EmitCtx } from "../types.ts";

export function emitConvex(ctx: EmitCtx): void {
  ctx.pkg.dependencies.convex = "^1.27.0";
  ctx.pkg.scripts.dev = "convex dev --once && vite dev";
  ctx.pkg.scripts["convex:dev"] = "convex dev";

  setFile(
    ctx.files,
    "convex/schema.ts",
    `import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    title: v.string(),
    body: v.string(),
    userId: v.string(),
  }).index("by_user", ["userId"]),
});
`,
  );

  setFile(
    ctx.files,
    "convex/notes.ts",
    `import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    return ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: { title: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    return ctx.db.insert("notes", {
      title: args.title,
      body: args.body,
      userId: identity.subject,
    });
  },
});
`,
  );

  setFile(
    ctx.files,
    "convex/auth.config.ts",
    `export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
`,
  );

  setFile(
    ctx.files,
    ".env",
    `VITE_CONVEX_URL="https://your-deployment.convex.cloud"
VITE_CLERK_PUBLISHABLE_KEY="pk_test_replace_me"
CLERK_SECRET_KEY="sk_test_replace_me"
CLERK_JWT_ISSUER_DOMAIN="https://your-clerk-domain"
`,
  );
  setFile(
    ctx.files,
    ".env.example",
    `VITE_CONVEX_URL="https://your-deployment.convex.cloud"
VITE_CLERK_PUBLISHABLE_KEY="pk_test_replace_me"
CLERK_SECRET_KEY="sk_test_replace_me"
CLERK_JWT_ISSUER_DOMAIN="https://your-clerk-domain"
`,
  );
}
