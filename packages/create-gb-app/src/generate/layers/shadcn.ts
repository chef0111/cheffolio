import { setFile } from "../files";
import type { EmitCtx } from "../types";

export function emitShadcn(ctx: EmitCtx): void {
  ctx.pkg.dependencies.clsx = "^2.1.1";
  ctx.pkg.dependencies["tailwind-merge"] = "^3.3.1";
  ctx.pkg.dependencies["class-variance-authority"] = "^0.7.1";

  const root = ctx.stack.frontend === "tanstack-start" ? "src/" : "";
  const css =
    ctx.stack.frontend === "tanstack-start" ? "src/styles.css" : "app/globals.css";

  setFile(
    ctx.files,
    `${root}lib/utils.ts`,
    `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
  );

  setFile(
    ctx.files,
    "components.json",
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema.json",
        style: "new-york",
        rsc: true,
        tsx: true,
        tailwind: {
          config: "",
          css,
          baseColor: "neutral",
          cssVariables: false,
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
        },
      },
      null,
      2,
    ),
  );

  setFile(
    ctx.files,
    `${root}components/ui/button.tsx`,
    `import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-3 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900",
        className,
      )}
      {...props}
    />
  );
}
`,
  );

  setFile(
    ctx.files,
    `${root}components/ui/input.tsx`,
    `import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border border-neutral-300 bg-transparent px-3 text-sm dark:border-neutral-700",
        className,
      )}
      {...props}
    />
  );
}
`,
  );

  setFile(
    ctx.files,
    `${root}components/ui/card.tsx`,
    `import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950",
        className,
      )}
      {...props}
    />
  );
}
`,
  );
}
