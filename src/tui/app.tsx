import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useMemo, useState } from "react";
import { formatCommand } from "../preview/command.ts";
import { previewTree } from "../preview/tree.ts";
import { CompatError } from "../stack/errors.ts";
import { resolveStack } from "../stack/resolve.ts";
import type {
  Api,
  Auth,
  Backend,
  Frontend,
  Payments,
  RawFlags,
} from "../stack/types.ts";

type FocusId = "backend" | "frontend" | "api" | "auth" | "payments" | "confirm";

const FOCUS_ORDER: FocusId[] = [
  "backend",
  "frontend",
  "api",
  "auth",
  "payments",
  "confirm",
];

const BACKEND_OPTIONS = [
  { name: "Self", description: "API in the same app", value: "self" },
  { name: "Nest", description: "apps/web, apps/server, packages/contract", value: "nest" },
  { name: "Convex", description: "convex/ directory", value: "convex" },
];

const FRONTEND_OPTIONS = [
  { name: "Next", description: "Next.js App Router", value: "next" },
  { name: "Start", description: "TanStack Start", value: "tanstack-start" },
];

const API_OPTIONS = [
  { name: "oRPC", description: "Router-first procedures", value: "orpc" },
  { name: "tRPC", description: "Router type from this app", value: "trpc" },
];

const AUTH_OPTIONS = [
  { name: "Better Auth", description: "Email and password", value: "better-auth" },
  { name: "Clerk", description: "Hosted auth", value: "clerk" },
  { name: "None", description: "Public notes", value: "none" },
];

function paymentOptions(auth: Auth | undefined) {
  const none = { name: "None", description: "No billing", value: "none" };
  if (auth === "none" || auth === undefined) {
    return [none];
  }
  const stripe = { name: "Stripe", description: "Checkout and portal", value: "stripe" };
  if (auth === "clerk") {
    return [none, stripe];
  }
  return [
    none,
    stripe,
    { name: "Polar", description: "Requires Better Auth", value: "polar" },
  ];
}

function indexOfValue(options: Array<{ value: string }>, value: string | undefined, fallback = 0) {
  const index = options.findIndex((option) => option.value === value);
  return index >= 0 ? index : fallback;
}

function nextFocus(current: FocusId, backend: Backend | undefined): FocusId {
  const order =
    backend === "convex"
      ? FOCUS_ORDER.filter((id) => id !== "api")
      : FOCUS_ORDER;
  const index = order.indexOf(current);
  return order[(index < 0 ? 0 : index + 1) % order.length];
}

export type AppProps = {
  initialFlags?: RawFlags;
  onExit?: () => void;
  onGenerate?: (flags: RawFlags) => void | Promise<void>;
};

function wizardFlags(initialFlags: RawFlags): RawFlags {
  const backend = initialFlags.backend ?? "self";
  const flags: RawFlags = {
    ...initialFlags,
    frontend: initialFlags.frontend ?? "next",
    backend,
    auth: initialFlags.auth ?? "better-auth",
    payments: initialFlags.payments ?? "none",
    ui: initialFlags.ui ?? "shadcn",
    linter: initialFlags.linter ?? "eslint",
    projectName: initialFlags.projectName ?? "my-gb-app",
  };
  if (backend === "convex") {
    flags.api = undefined;
    flags.database = undefined;
    flags.orm = undefined;
    if (flags.dbSetup !== "none") {
      flags.dbSetup = undefined;
    }
  } else if (flags.api === undefined) {
    flags.api = "orpc";
  }
  if (backend === "nest") {
    flags.api = "orpc";
  }
  return flags;
}

export function App({ initialFlags = {}, onExit, onGenerate }: AppProps) {
  const { width } = useTerminalDimensions();
  const stacked = width < 72;
  const [flags, setFlags] = useState<RawFlags>(() => wizardFlags(initialFlags));
  const [focus, setFocus] = useState<FocusId>("backend");

  const payments = paymentOptions(flags.auth);
  const polarAvailable = flags.auth === "better-auth";

  const resolved = useMemo(() => {
    try {
      return { stack: resolveStack(flags), error: null };
    } catch (error) {
      const message = error instanceof CompatError ? error.message : String(error);
      return { stack: null, error: message };
    }
  }, [flags]);

  useKeyboard((key) => {
    if (key.name === "escape") {
      onExit?.();
      return;
    }
    if (key.name === "tab") {
      setFocus((current: FocusId) => nextFocus(current, flags.backend));
    }
  });

  function patch(next: Partial<RawFlags>) {
    setFlags((current: RawFlags) => {
      const merged = { ...current, ...next };
      if (merged.backend === "convex") {
        merged.api = undefined;
        merged.database = undefined;
        merged.orm = undefined;
        merged.dbSetup = undefined;
      }
      if (merged.backend === "nest") {
        merged.api = "orpc";
      }
      if (merged.auth === "none") {
        merged.payments = "none";
      }
      if (merged.auth === "clerk" && merged.payments === "polar") {
        merged.payments = "none";
      }
      return merged;
    });
  }

  const tree = resolved.stack ? previewTree(resolved.stack) : resolved.error ?? "";
  const command = formatCommand(flags);
  const convexHidesApi = flags.backend === "convex";

  return (
    <box flexDirection="column" paddingLeft={1} paddingRight={1}>
      <text>create-gb-app</text>
      <text>{command}</text>
      <box flexDirection={stacked ? "column" : "row"} gap={1} flexGrow={1}>
        <box flexDirection="column" width={stacked ? undefined : 28}>
          <text>Backend</text>
          <select
            focused={focus === "backend"}
            height={3}
            showDescription={false}
            options={BACKEND_OPTIONS}
            selectedIndex={indexOfValue(BACKEND_OPTIONS, flags.backend)}
            onChange={(_index, option) => {
              if (option?.value) {
                patch({ backend: option.value as Backend });
              }
            }}
          />
          <text>Frontend</text>
          <select
            focused={focus === "frontend"}
            height={2}
            showDescription={false}
            options={FRONTEND_OPTIONS}
            selectedIndex={indexOfValue(FRONTEND_OPTIONS, flags.frontend)}
            onChange={(_index, option) => {
              if (option?.value) {
                patch({ frontend: option.value as Frontend });
              }
            }}
          />
          {flags.backend === "convex" ? null : (
            <box flexDirection="column">
              <text>API</text>
              <select
                focused={focus === "api"}
                height={2}
                showDescription={false}
                options={
                  flags.backend === "nest"
                    ? API_OPTIONS.filter((option) => option.value === "orpc")
                    : API_OPTIONS
                }
                selectedIndex={indexOfValue(API_OPTIONS, flags.api)}
                onChange={(_index, option) => {
                  if (option?.value) {
                    patch({ api: option.value as Api });
                  }
                }}
              />
            </box>
          )}
          <text>Auth</text>
          <select
            focused={focus === "auth"}
            height={3}
            showDescription={false}
            options={AUTH_OPTIONS}
            selectedIndex={indexOfValue(AUTH_OPTIONS, flags.auth)}
            onChange={(_index, option) => {
              if (option?.value) {
                patch({ auth: option.value as Auth });
              }
            }}
          />
          <text>Payments</text>
          <select
            focused={focus === "payments"}
            height={3}
            showDescription={false}
            options={payments}
            selectedIndex={indexOfValue(payments, flags.payments)}
            onChange={(_index, option) => {
              if (option?.value) {
                patch({ payments: option.value as Payments });
              }
            }}
          />
          <select
            focused={focus === "confirm"}
            height={1}
            showDescription={false}
            options={[{ name: "Generate", description: "Write files", value: "go" }]}
            onSelect={() => {
              void onGenerate?.(flags);
            }}
          />
        </box>
        <box flexDirection="column" flexGrow={1} border>
          <text>Tree</text>
          <text>{tree}</text>
          <text>Command</text>
          <text>{command}</text>
          <text>{polarAvailable ? "Polar available" : "Polar unavailable"}</text>
          <text>{convexHidesApi ? "API and database hidden" : "API visible"}</text>
        </box>
      </box>
      <text>Tab cycles. Escape exits. Enter on Generate writes files.</text>
    </box>
  );
}
