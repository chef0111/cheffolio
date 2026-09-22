# create-gb-app

```sh
npx create-gb-app my-gb-app --yes
pnpm create gb-app my-gb-app --yes
bunx create-gb-app my-gb-app --yes
```

```sh
npx create-gb-app my-gb-app --frontend next --backend self --api orpc
npx create-gb-app my-gb-app --backend nest
npx create-gb-app my-gb-app --backend convex --frontend tanstack-start --auth clerk
npx create-gb-app my-gb-app --frontend tanstack-start --backend self --api trpc --auth none --ui none --linter oxlint
```

`--yes` writes the default stack: Next, Self, oRPC, Postgres, Prisma, Better Auth, shadcn, ESLint plus Prettier, payments none, db-setup none. Flags after `--yes` override those defaults.

```sh
npx create-gb-app my-gb-app --yes --preset nest
npx create-gb-app my-gb-app --yes --preset g111 --frontend tanstack-start
```

`--preset` expands to stack flags. Named values `nest`, `start`, and `convex` are aliases. Compact codes start with `g1`. Explicit stack flags overlay the preset.
