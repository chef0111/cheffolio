import { setFile } from "../files.ts";
import type { EmitCtx } from "../types.ts";

export function emitNotes(ctx: EmitCtx): void {
  if (ctx.stack.backend === "convex") {
    emitConvexNotes(ctx);
    return;
  }
  if (
    ctx.stack.frontend === "tanstack-start" &&
    ctx.stack.backend === "self" &&
    ctx.stack.api === "trpc"
  ) {
    emitStartTrpcNotes(ctx);
    return;
  }

  setFile(
    ctx.files,
    "router.ts",
    `import { ORPCError, os } from "@orpc/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const base = os.$context<{ headers: Headers }>();

const authed = base.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({ context: { user: session.user } });
});

export const router = {
  me: authed.handler(async ({ context }) => context.user),
  notes: {
    list: authed.handler(async ({ context }) => {
      return prisma.note.findMany({
        where: { userId: context.user.id },
        orderBy: { createdAt: "desc" },
      });
    }),
    create: authed
      .input(z.object({ title: z.string().min(1), body: z.string() }))
      .handler(async ({ input, context }) => {
        return prisma.note.create({
          data: {
            title: input.title,
            body: input.body,
            userId: context.user.id,
          },
        });
      }),
    update: authed
      .input(
        z.object({
          id: z.string(),
          title: z.string().min(1),
          body: z.string(),
        }),
      )
      .handler(async ({ input, context }) => {
        const note = await prisma.note.findFirst({
          where: { id: input.id, userId: context.user.id },
        });
        if (!note) {
          throw new ORPCError("NOT_FOUND");
        }
        return prisma.note.update({
          where: { id: note.id },
          data: { title: input.title, body: input.body },
        });
      }),
    delete: authed
      .input(z.object({ id: z.string() }))
      .handler(async ({ input, context }) => {
        const note = await prisma.note.findFirst({
          where: { id: input.id, userId: context.user.id },
        });
        if (!note) {
          throw new ORPCError("NOT_FOUND");
        }
        await prisma.note.delete({ where: { id: note.id } });
        return { ok: true };
      }),
  },
};
`,
  );

  setFile(
    ctx.files,
    "app/notes/page.tsx",
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
    "app/notes/notes-client.tsx",
    `"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
        <Input
          name="title"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <Input
          name="body"
          placeholder="Body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
        <Button type="submit" disabled={create.isPending}>
          Add note
        </Button>
      </form>
      {notes.error ? (
        <p className="text-sm">
          Sign in to load notes. {String(notes.error.message ?? "")}
        </p>
      ) : null}
      <ul className="flex flex-col gap-3">
        {(notes.data ?? []).map((note) => (
          <li key={note.id}>
            <Card className="p-4">
              <h2 className="font-medium">{note.title}</h2>
              <p className="text-sm opacity-80">{note.body}</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
  );
}

function emitStartTrpcNotes(ctx: EmitCtx): void {

  setFile(
    ctx.files,
    "src/server/router.ts",
    `import { z } from "zod";
import { prisma } from "../lib/db";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  notes: {
    list: publicProcedure.query(async () => {
      return prisma.note.findMany({ orderBy: { createdAt: "desc" } });
    }),
    create: publicProcedure
      .input(z.object({ title: z.string().min(1), body: z.string() }))
      .mutation(async ({ input }) => {
        return prisma.note.create({
          data: { title: input.title, body: input.body },
        });
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().min(1),
          body: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        return prisma.note.update({
          where: { id: input.id },
          data: { title: input.title, body: input.body },
        });
      }),
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await prisma.note.delete({ where: { id: input.id } });
        return { ok: true };
      }),
  },
});

export type AppRouter = typeof appRouter;
`,
  );

  setFile(
    ctx.files,
    "src/routes/notes.tsx",
    `import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { trpc } from "../lib/trpc";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
});

function NotesPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const notes = trpc.notes.list.useQuery();
  const utils = trpc.useUtils();
  const create = trpc.notes.create.useMutation({
    onSuccess: async () => {
      setTitle("");
      setBody("");
      await utils.notes.list.invalidate();
    },
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Notes</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          create.mutate({ title, body });
        }}
      >
        <label>
          Title
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>
        <label>
          Body
          <input
            name="body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </label>
        <button type="submit" disabled={create.isPending}>
          Add note
        </button>
      </form>
      {notes.error ? <p>{notes.error.message}</p> : null}
      <ul>
        {(notes.data ?? []).map((note) => (
          <li key={note.id}>
            <article>
              <h2>{note.title}</h2>
              <p>{note.body}</p>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
`,
  );
}

function emitConvexNotes(ctx: EmitCtx): void {
  const ui = ctx.stack.ui === "shadcn";
  setFile(
    ctx.files,
    "src/routes/notes.tsx",
    `import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
${ui ? `import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";` : ""}

export const Route = createFileRoute("/notes")({
  component: NotesPage,
});

function NotesPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const notes = useQuery(api.notes.list);
  const create = useMutation(api.notes.create);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Notes</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void create({ title, body });
          setTitle("");
          setBody("");
        }}
      >
        ${
          ui
            ? `<Input name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <Input name="body" value={body} onChange={(event) => setBody(event.target.value)} />
        <Button type="submit">Add note</Button>`
            : `<input name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <input name="body" value={body} onChange={(event) => setBody(event.target.value)} />
        <button type="submit">Add note</button>`
        }
      </form>
      <ul>
        {(notes ?? []).map((note) => (
          <li key={note._id}>
            ${
              ui
                ? `<Card className="p-4"><h2 className="font-medium">{note.title}</h2><p>{note.body}</p></Card>`
                : `<article><h2>{note.title}</h2><p>{note.body}</p></article>`
            }
          </li>
        ))}
      </ul>
    </main>
  );
}
`,
  );
}


