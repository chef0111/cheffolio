import type { RawFlags } from "../stack/types.ts";

const FRONTENDS = ["next", "tanstack-start"] as const;
const BACKENDS = ["self", "nest", "convex"] as const;
const APIS = ["orpc", "trpc"] as const;
const DATABASES = ["postgres", "sqlite", "mysql"] as const;
const ORMS = ["prisma", "drizzle"] as const;
const DB_SETUPS = ["none", "docker", "neon", "supabase"] as const;
const AUTHS = ["none", "better-auth", "clerk"] as const;
const PAYMENTS = ["none", "stripe", "polar"] as const;
const UIS = ["shadcn", "none"] as const;
const LINTERS = ["eslint", "biome", "oxlint"] as const;

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

function oneOf<T extends string>(
  name: string,
  value: string,
  allowed: readonly T[],
): T {
  if ((allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  throw new ParseError(
    `invalid ${name} "${value}". expected ${allowed.join("|")}`,
  );
}

function takeValue(argv: string[], index: number, name: string): {
  value: string;
  consumed: number;
} {
  const current = argv[index];
  const eq = current.indexOf("=");
  if (eq >= 0) {
    const value = current.slice(eq + 1);
    if (!value) {
      throw new ParseError(`missing value for ${name}`);
    }
    return { value, consumed: 0 };
  }
  const next = argv[index + 1];
  if (!next || next.startsWith("-")) {
    throw new ParseError(`missing value for ${name}`);
  }
  return { value: next, consumed: 1 };
}

export function parseArgs(argv: string[]): RawFlags {
  const flags: RawFlags = {};
  const positionals: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      flags.help = true;
      continue;
    }
    if (arg === "--version" || arg === "-v") {
      flags.version = true;
      continue;
    }
    if (arg === "--yes" || arg === "-y") {
      flags.yes = true;
      continue;
    }
    if (arg === "--no-git") {
      flags.noGit = true;
      continue;
    }
    if (arg === "--no-install") {
      flags.noInstall = true;
      continue;
    }
    if (!arg.startsWith("-")) {
      positionals.push(arg);
      continue;
    }

    const name = arg.includes("=") ? arg.slice(0, arg.indexOf("=")) : arg;
    switch (name) {
      case "--frontend": {
        const { value, consumed } = takeValue(argv, i, name);
        flags.frontend = oneOf("frontend", value, FRONTENDS);
        i += consumed;
        break;
      }
      case "--backend": {
        const { value, consumed } = takeValue(argv, i, name);
        flags.backend = oneOf("backend", value, BACKENDS);
        i += consumed;
        break;
      }
      case "--api": {
        const { value, consumed } = takeValue(argv, i, name);
        flags.api = oneOf("api", value, APIS);
        i += consumed;
        break;
      }
      case "--database": {
        const { value, consumed } = takeValue(argv, i, name);
        flags.database = oneOf("database", value, DATABASES);
        i += consumed;
        break;
      }
      case "--orm": {
        const { value, consumed } = takeValue(argv, i, name);
        flags.orm = oneOf("orm", value, ORMS);
        i += consumed;
        break;
      }
      case "--db-setup": {
        const { value, consumed } = takeValue(argv, i, name);
        flags.dbSetup = oneOf("db-setup", value, DB_SETUPS);
        i += consumed;
        break;
      }
      case "--auth": {
        const { value, consumed } = takeValue(argv, i, name);
        flags.auth = oneOf("auth", value, AUTHS);
        i += consumed;
        break;
      }
      case "--payments": {
        const { value, consumed } = takeValue(argv, i, name);
        flags.payments = oneOf("payments", value, PAYMENTS);
        i += consumed;
        break;
      }
      case "--ui": {
        const { value, consumed } = takeValue(argv, i, name);
        flags.ui = oneOf("ui", value, UIS);
        i += consumed;
        break;
      }
      case "--linter": {
        const { value, consumed } = takeValue(argv, i, name);
        flags.linter = oneOf("linter", value, LINTERS);
        i += consumed;
        break;
      }
      default:
        throw new ParseError(`unknown flag ${name}`);
    }
  }

  if (positionals[0]) {
    flags.projectName = positionals[0];
  }
  return flags;
}

export const USAGE = `create-gb-app [dir] [flags]

  npx create-gb-app my-app --yes
  pnpm create gb-app my-app --yes
  bunx create-gb-app my-app --yes

Flags
  --help, -h
  --version, -v
  --yes, -y
  --frontend next|tanstack-start
  --backend self|nest|convex
  --api orpc|trpc
  --database postgres|sqlite|mysql
  --orm prisma|drizzle
  --db-setup none|docker|neon|supabase
  --auth none|better-auth|clerk
  --payments none|stripe|polar
  --ui shadcn|none
  --linter eslint|biome|oxlint
  --no-git
  --no-install
`;
