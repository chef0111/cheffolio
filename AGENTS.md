# AI agent guidelines for cheffolio (giabao.dev)

Next.js 16 (App Router) portfolio, blog, and shadcn registry website.

**Stack**: TypeScript, React 19, Tailwind CSS v4, MDX, Bun, Vercel

## Project structure

| Directory                              | Purpose                                                    |
| -------------------------------------- | ---------------------------------------------------------- |
| `src/app/`                             | App Router pages, layouts, API routes                      |
| `src/components/cheffolio/`            | Shared UI components                                       |
| `src/features/`                        | Feature modules: `blog`, `portfolio`, `projects`, `resume` |
| `src/config/`                          | Site (`site.ts`), JSON-LD config                           |
| `src/scripts/`                         | Build scripts (capture) run with Bun                       |
| `src/hooks/`, `src/lib/`, `src/utils/` | Hooks, libraries, utilities                                |

## Content system

All content lives in `src/features/blog/content/` as MDX files.

- **Data layer**: `src/features/blog/lib/data.ts` (`getAllBlogs`, `getBlogBySlug`)
- **Blog UI**: `src/features/blog/components/`
- **Portfolio UI**: `src/features/portfolio/components/`
- **Projects UI**: `src/features/projects/components/`
- **Resume UI**: `src/features/resume/components/`

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
bun run dev                 # Dev server
bun run build               # Production build
bun run lint                # ESLint
bun run lint:fix            # ESLint with --fix
bun run format              # Prettier
bun run typecheck           # Type checking (tsc --noEmit)
bun run upgrade:next        # Upgrade Next.js
bun run upgrade:tailwind    # Upgrade Tailwind CSS
bun run capture             # Capture screenshots of components
bun run capture:sync        # Capture screenshots of components and sync to R2
```

### Local dev URL

A dev server is usually already running behind `https://cheffolio.localhost` (see `allowedDevOrigins` in `next.config.ts` and `NEXT_PUBLIC_APP_URL` in `.env.local`). Use that origin to test pages and routes, never `http://localhost:3000` or a raw port. It also makes generated absolute URLs match what the code produces.
