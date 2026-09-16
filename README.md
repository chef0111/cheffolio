# create-gb-app

```sh
npx create-gb-app my-app --yes
pnpm create gb-app my-app --yes
bunx create-gb-app my-app --yes
```

```sh
npx create-gb-app my-app --frontend next --backend self --api orpc
npx create-gb-app my-app --backend nest
npx create-gb-app my-app --backend convex --frontend tanstack-start --auth clerk
npx create-gb-app my-app --frontend tanstack-start --backend self --api trpc --auth none --ui none --linter oxlint
```

`--yes` writes the default stack: Next, Self, oRPC, Postgres, Prisma, Better Auth, shadcn, ESLint plus Prettier, payments none, db-setup none. Flags after `--yes` override those defaults.
