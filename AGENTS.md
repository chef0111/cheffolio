# AI agent guidelines for cheffolio (giabao.dev)

Next.js 16 (App Router) portfolio, blog, and shadcn registry website.

**Stack**: TypeScript, React 19, Tailwind CSS v4, MDX, Bun, Vercel

## Project structure

| Directory | Purpose |
| -------------------------- | -------------------------------------------------------- |
| `apps/web/` | Next.js site (App Router, blog, Create, resume) |
| `packages/create-gb-app/` | CLI and generate/preset source the site imports |
| `apps/web/app/` | App Router pages, layouts, API routes |
| `apps/web/components/cheffolio/` | Shared UI components |
| `apps/web/features/` | Feature modules: `blog`, `portfolio`, `create`, `resume` |
| `apps/web/config/` | Site (`site.ts`), JSON-LD config |
| `apps/web/scripts/` | Build scripts (capture) run with Bun |
| `apps/web/hooks/`, `lib/`, `utils/` | Hooks, libraries, utilities |
| `apps/web/docs/` | Documentation content (blog, resume) |

## Content system

All content lives in `apps/web/docs/blog/` and `apps/web/docs/resume/` as MDX files.

- **Data layer**: `apps/web/features/blog/lib/data.ts` (`getAllDocs`, `getDocBySlug`)
- **Blog UI**: `apps/web/features/blog/components/`
- **Portfolio UI**: `apps/web/features/portfolio/components/`
- **Create UI**: `apps/web/features/create/components/`
- **Resume UI**: `apps/web/features/resume/components/`

## Coding guidelines

- TypeScript strict mode; explicit types when necessary
- kebab-case file naming
- Descriptive names; comments only for "why", not "what"
- No emojis in code, comments, or commit messages
- Tailwind CSS v4 syntax; support dark/light modes
- Follow SOLID principles
- Headings in sentence-case (capitalize only the first word and proper nouns), applies to Markdown/MDX docs and prose

### Writting React components

- Leverage shadcn/ui components and composition rules for the baseline UI
- Use the combo /vercel-react-best-practices + /vercel-composition-patterns to write new or refactor existing React components

## Commands

```bash
bun run dev                 # Dev server (`turbo run dev --filter=web`)
bun run build               # Production build (`turbo run build --filter=web`)
bun run lint                # ESLint
bun run lint:fix            # ESLint with --fix
bun run format              # Prettier
bun run typecheck           # Type checking (tsc --noEmit)
bun run upgrade:next        # Upgrade Next.js
bun run upgrade:tailwind    # Upgrade Tailwind CSS
bun run capture             # Capture screenshots of components
bun run capture:sync        # Capture screenshots of components and sync to R2
bun run render:resume       # Render resume PDF
```

Website scripts also run with `bun run --filter web <script>`.

### Local dev URL

A dev server is usually already running behind `https://cheffolio.localhost` (see Portless `"cheffolio"` on the `web` package and `NEXT_PUBLIC_APP_URL` in `apps/web/.env.local`). Use that origin to test pages and routes, never `http://localhost:3000` or a raw port. It also makes generated absolute URLs match what the code produces.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
