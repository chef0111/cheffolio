import type { EmitCtx } from '../../types/generate';
import { DEPENDENCY_VERSIONS } from '../dependency-versions';
import { setFile } from '../files';

function loginFields(form: EmitCtx['stack']['form'], ui: string): string {
  if (form === 'react-hook-form') {
    return `import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";

type LoginValues = { name: string; email: string; password: string };
`;
  }
  if (form === 'tanstack-form') {
    return `import { useAppForm } from "@/components/form/hooks";
`;
  }
  return `import { Input } from "${ui}input";
import { Field, FieldLabel } from "${ui}field";
`;
}

function loginState(form: EmitCtx['stack']['form']): string {
  if (form === 'react-hook-form') {
    return `  const form = useForm<LoginValues>({ defaultValues: { name: "", email: "", password: "" } });
  const pending = form.formState.isSubmitting;
  async function submit(values: LoginValues) {
    setError(null);
    const result = mode === "signup"
      ? await authClient.signUp.email({ email: values.email, password: values.password, name: values.name })
      : await authClient.signIn.email({ email: values.email, password: values.password });
    if (result.error) { setError(result.error.message ?? "Authentication failed"); return; }
    onSuccess();
  }
`;
  }
  if (form === 'tanstack-form') {
    return `  const form = useAppForm({
    defaultValues: { name: "", email: "", password: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      const result = mode === "signup"
        ? await authClient.signUp.email({ email: value.email, password: value.password, name: value.name })
        : await authClient.signIn.email({ email: value.email, password: value.password });
      if (result.error) { setError(result.error.message ?? "Authentication failed"); return; }
      onSuccess();
    },
  });
`;
  }
  return `  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null); setPending(true);
    try {
      const result = mode === "signup"
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password });
      if (result.error) { setError(result.error.message ?? "Authentication failed"); return; }
      onSuccess();
    } finally { setPending(false); }
  }
`;
}

function fieldMarkup(form: EmitCtx['stack']['form']): string {
  if (form === 'react-hook-form') {
    return `          {mode === "signup" ? <FormInput control={form.control} name="name" label="Name" autoComplete="name" required disabled={pending} /> : null}
          <FormInput control={form.control} name="email" label="Email" type="email" autoComplete="email" placeholder="m@example.com" required disabled={pending} />
          <FormInput control={form.control} name="password" label="Password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required disabled={pending} />
`;
  }
  if (form === 'tanstack-form') {
    return `          {mode === "signup" ? <form.AppField name="name">{(field) => <field.Input label="Name" autoComplete="name" required />}</form.AppField> : null}
          <form.AppField name="email">{(field) => <field.Input label="Email" type="email" autoComplete="email" placeholder="m@example.com" required />}</form.AppField>
          <form.AppField name="password">{(field) => <field.Input label="Password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required />}</form.AppField>
`;
  }
  return `          {mode === "signup" ? <Field><FieldLabel htmlFor="name">Name</FieldLabel><Input id="name" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required disabled={pending} /></Field> : null}
          <Field><FieldLabel htmlFor="email">Email</FieldLabel><Input id="email" name="email" type="email" autoComplete="email" placeholder="m@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={pending} /></Field>
          <Field><FieldLabel htmlFor="password">Password</FieldLabel><Input id="password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required disabled={pending} /></Field>
`;
}

function loginFormSource(ctx: EmitCtx): string {
  const ui =
    ctx.layout.structure === 'single' ? '@/components/ui/' : '@repo/ui/';
  const form = ctx.stack.form;
  const opening =
    form === 'react-hook-form'
      ? '<form onSubmit={form.handleSubmit(submit)}>'
      : form === 'tanstack-form'
        ? '<form onSubmit={(event) => { event.preventDefault(); event.stopPropagation(); void form.handleSubmit(); }}>'
        : '<form onSubmit={submit}>';
  const fields = fieldMarkup(form);
  const submitButton =
    form === 'tanstack-form'
      ? '<form.Subscribe selector={(state) => state.isSubmitting}>{(pending) => <Button type="submit" disabled={pending}>{pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</Button>}</form.Subscribe>'
      : '<Button type="submit" disabled={pending}>{pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</Button>';
  return `"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "${ui}button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "${ui}card";
import { FieldDescription, FieldGroup } from "${ui}field";
${loginFields(form, ui)}
export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
${loginState(form)}
  return <Card>
    <CardHeader className="text-center">
      <CardTitle className="text-xl">{mode === "signin" ? "Welcome back" : "Create an account"}</CardTitle>
      <CardDescription>{mode === "signin" ? "Sign in with your email and password." : "Enter your details to get started."}</CardDescription>
    </CardHeader>
    <CardContent>
      ${opening}
        ${form === 'tanstack-form' ? '<form.AppForm>' : ''}<FieldGroup>
${fields}          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          ${submitButton}
          <FieldDescription className="text-center">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button type="button" className="underline underline-offset-4" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}>
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </FieldDescription>
        </FieldGroup>${form === 'tanstack-form' ? '</form.AppForm>' : ''}
      </form>
    </CardContent>
  </Card>;
}
`;
}

export function emitLogin(ctx: EmitCtx): void {
  if (ctx.stack.auth !== 'better-auth') return;
  const isNext = ctx.stack.frontend === 'next';
  const webRoot = ctx.layout.frontendRoot ? `${ctx.layout.frontendRoot}/` : '';
  const sourceRoot = webRoot + (isNext ? '' : 'src/');
  const pagePath = isNext
    ? `${webRoot}app/login/page.tsx`
    : `${sourceRoot}routes/login.tsx`;
  if (!(pagePath in ctx.files)) return;

  if (ctx.layout.structure === 'single') {
    ctx.pkg.dependencies['lucide-react'] = DEPENDENCY_VERSIONS['lucide-react'];
  } else {
    const manifest = JSON.parse(ctx.files[ctx.layout.frontendManifest]!);
    manifest.dependencies['lucide-react'] = DEPENDENCY_VERSIONS['lucide-react'];
    setFile(
      ctx.files,
      ctx.layout.frontendManifest,
      JSON.stringify(manifest, null, 2)
    );
  }

  setFile(
    ctx.files,
    `${sourceRoot}components/login-form.tsx`,
    loginFormSource(ctx)
  );
  const page = isNext
    ? `"use client";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const router = useRouter();
  return <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex items-center gap-2 self-center font-medium"><span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"><GalleryVerticalEnd className="size-4" /></span>${JSON.stringify(ctx.projectName)}</div>
      <LoginForm onSuccess={() => { router.push("/notes"); router.refresh(); }} />
    </div>
  </main>;
}
`
    : `import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  return <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex items-center gap-2 self-center font-medium"><span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"><GalleryVerticalEnd className="size-4" /></span>${JSON.stringify(ctx.projectName)}</div>
      <LoginForm onSuccess={() => { void navigate({ to: "/notes" }); }} />
    </div>
  </main>;
}
`;
  setFile(ctx.files, pagePath, page);
}
