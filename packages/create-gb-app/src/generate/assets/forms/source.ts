const fieldImports = `import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";`;

export const rhfFormAssets = {
  'form-base.tsx': `"use client";

import { useId, type ReactNode } from "react";
import { Controller, type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form";
${fieldImports}

export type FormControlProps<TValues extends FieldValues, TName extends FieldPath<TValues>, TOutput = TValues> = {
  control: ControllerProps<TValues, TName, TOutput>["control"];
  name: TName;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  fieldClassName?: string;
};

export type FormControlFn<TExtra = Record<never, never>> = <
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
  TOutput = TValues,
>(props: FormControlProps<TValues, TName, TOutput> & TExtra) => ReactNode;

type ControlState<TValues extends FieldValues, TName extends FieldPath<TValues>, TOutput> =
  Parameters<ControllerProps<TValues, TName, TOutput>["render"]>[0]["field"] & {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  };

export function FormBase<TValues extends FieldValues, TName extends FieldPath<TValues>, TOutput = TValues>({
  children, control, name, label, description, disabled, fieldClassName,
}: FormControlProps<TValues, TName, TOutput> & {
  children: (field: ControlState<TValues, TName, TOutput>) => ReactNode;
}) {
  const id = useId();
  // Keep values registered while pending; Controller disabled omits them on retries.
  return <Controller control={control} name={name} render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid} data-disabled={disabled || field.disabled} className={fieldClassName}>
      {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
      {children({ ...field, disabled: disabled || field.disabled, id, "aria-invalid": fieldState.invalid,
        "aria-describedby": [description ? id + "-description" : null, fieldState.invalid ? id + "-error" : null].filter(Boolean).join(" ") || undefined,
      })}
      {description ? <FieldDescription id={id + "-description"}>{description}</FieldDescription> : null}
      {fieldState.invalid ? <FieldError id={id + "-error"} errors={[fieldState.error]} /> : null}
    </Field>
  )} />;
}
`,
  'form-input.tsx': `"use client";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { FormBase, type FormControlFn } from "./form-base";

export const FormInput: FormControlFn<Omit<ComponentProps<typeof Input>, "name" | "id" | "value" | "defaultValue" | "onChange" | "onValueChange" | "onBlur" | "ref">> = ({ control, name, label, description, disabled, fieldClassName, ...props }) => (
  <FormBase {...{ control, name, label, description, disabled, fieldClassName }}>
    {(field) => <Input {...props} {...field} value={field.value ?? ""} />}
  </FormBase>
);
`,
  'form-textarea.tsx': `"use client";
import type { ComponentProps } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FormBase, type FormControlFn } from "./form-base";

export const FormTextarea: FormControlFn<Omit<ComponentProps<typeof Textarea>, "name" | "id" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref">> = ({ control, name, label, description, disabled, fieldClassName, ...props }) => (
  <FormBase {...{ control, name, label, description, disabled, fieldClassName }}>
    {(field) => <Textarea {...props} {...field} value={field.value ?? ""} />}
  </FormBase>
);
`,
  'form-checkbox.tsx': `"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { FormBase, type FormControlFn } from "./form-base";

export const FormCheckbox: FormControlFn = (props) => (
  <FormBase {...props}>
    {({ value, onChange, ...field }) => <Checkbox {...field} checked={value === true} onCheckedChange={(checked) => onChange(checked)} />}
  </FormBase>
);
`,
  'form-select.tsx': `"use client";
import type { FieldPath, FieldPathValue, FieldValues } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormBase, type FormControlProps } from "./form-base";

export function FormSelect<TValues extends FieldValues, TName extends FieldPath<TValues>, TOutput = TValues>({
  options, placeholder, onValueChange, ...props
}: FormControlProps<TValues, TName, TOutput> & {
  options: { label: string; value: FieldPathValue<TValues, TName> }[];
  placeholder?: string;
  onValueChange?: (value: FieldPathValue<TValues, TName> | null) => void;
}) {
  return <FormBase {...props}>{({ value, onChange, onBlur, ref, ...field }) => (
    <Select<FieldPathValue<TValues, TName>> items={options} value={value} name={field.name} disabled={field.disabled}
      onValueChange={(next) => { onChange(next); onValueChange?.(next); }}>
      <SelectTrigger {...field} ref={ref} onBlur={onBlur}><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent><SelectGroup>{options.map((option) => <SelectItem key={String(option.value)} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent>
    </Select>
  )}</FormBase>;
}
`,
};

export const tanstackFormAssets = {
  'contexts.tsx': `"use client";
import { createFormHookContexts } from "@tanstack/react-form";
export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();
`,
  'hooks.tsx': `"use client";
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./contexts";
import { FormInput } from "./form-input";
import { FormTextarea } from "./form-textarea";
import { FormSelect } from "./form-select";
import { FormCheckbox } from "./form-checkbox";
export const { useAppForm, withForm } = createFormHook({
  fieldContext, formContext,
  fieldComponents: { Input: FormInput, Textarea: FormTextarea, Select: FormSelect, Checkbox: FormCheckbox },
  formComponents: {},
});
`,
  'form-base.tsx': `"use client";
import { useId, type ReactNode } from "react";
import { useFieldContext } from "./contexts";
${fieldImports}

export type FormControlProps = { label?: ReactNode; description?: ReactNode; disabled?: boolean; fieldClassName?: string };
type Accessibility = { id: string; "aria-invalid": boolean; "aria-describedby": string | undefined };

export function FormBase({ children, label, description, disabled, fieldClassName }: FormControlProps & { children: (props: Accessibility) => ReactNode }) {
  const field = useFieldContext<unknown>();
  const id = useId();
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const messages = field.state.meta.errors.flatMap((error) => {
    if (typeof error === "string") return [{ message: error }];
    if (error && typeof error === "object" && "message" in error && typeof error.message === "string") return [{ message: error.message }];
    return [];
  });
  return <Field data-invalid={invalid} data-disabled={disabled} className={fieldClassName}>
    {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
    {children({ id, "aria-invalid": invalid,
      "aria-describedby": [description ? id + "-description" : null, invalid ? id + "-error" : null].filter(Boolean).join(" ") || undefined,
    })}
    {description ? <FieldDescription id={id + "-description"}>{description}</FieldDescription> : null}
    {invalid ? <FieldError id={id + "-error"} errors={messages} /> : null}
  </Field>;
}
`,
  'form-input.tsx': `"use client";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "./contexts";
import { FormBase, type FormControlProps } from "./form-base";

export function FormInput({ label, description, disabled, fieldClassName, ...props }: FormControlProps & Omit<ComponentProps<typeof Input>, "name" | "id" | "value" | "defaultValue" | "onChange" | "onValueChange" | "onBlur">) {
  const field = useFieldContext<string>();
  return <FormBase {...{ label, description, disabled, fieldClassName }}>{(accessibility) => (
    <Input {...props} {...accessibility} name={field.name} value={field.state.value} disabled={disabled}
      onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} />
  )}</FormBase>;
}
`,
  'form-textarea.tsx': `"use client";
import type { ComponentProps } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "./contexts";
import { FormBase, type FormControlProps } from "./form-base";

export function FormTextarea({ label, description, disabled, fieldClassName, ...props }: FormControlProps & Omit<ComponentProps<typeof Textarea>, "name" | "id" | "value" | "defaultValue" | "onChange" | "onBlur">) {
  const field = useFieldContext<string>();
  return <FormBase {...{ label, description, disabled, fieldClassName }}>{(accessibility) => (
    <Textarea {...props} {...accessibility} name={field.name} value={field.state.value} disabled={disabled}
      onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} />
  )}</FormBase>;
}
`,
  'form-checkbox.tsx': `"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { useFieldContext } from "./contexts";
import { FormBase, type FormControlProps } from "./form-base";

export function FormCheckbox(props: FormControlProps) {
  const field = useFieldContext<boolean>();
  return <FormBase {...props}>{(accessibility) => (
    <Checkbox {...accessibility} name={field.name} checked={field.state.value} disabled={props.disabled}
      onBlur={field.handleBlur} onCheckedChange={(checked) => field.handleChange(checked)} />
  )}</FormBase>;
}
`,
  'form-select.tsx': `"use client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFieldContext } from "./contexts";
import { FormBase, type FormControlProps } from "./form-base";

export function FormSelect<TValue extends string>({ options, placeholder, ...props }: FormControlProps & {
  options: { label: string; value: TValue }[];
  placeholder?: string;
}) {
  const field = useFieldContext<TValue | null>();
  return <FormBase {...props}>{(accessibility) => (
    <Select<TValue> items={options} value={field.state.value} name={field.name} disabled={props.disabled} onValueChange={(value) => field.handleChange(value)}>
      <SelectTrigger {...accessibility} onBlur={field.handleBlur} disabled={props.disabled}><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent><SelectGroup>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent>
    </Select>
  )}</FormBase>;
}
`,
};

export function notesFormSource(
  library: 'react-hook-form' | 'tanstack-form'
): string {
  const common = `"use client";
import { useState } from "react";
import { noteInputSchema, type NoteInput } from "@/lib/note-validation";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
type NotesFormProps = { onSubmit: (input: NoteInput) => Promise<void>; persistent?: boolean };
`;
  if (library === 'react-hook-form')
    return (
      common +
      `
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { FormInput } from "./form-input";
import { FormTextarea } from "./form-textarea";

export function NotesForm({ onSubmit, persistent = true }: NotesFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<z.input<typeof noteInputSchema>, unknown, z.output<typeof noteInputSchema>>({
    resolver: zodResolver(noteInputSchema), defaultValues: { title: "", body: "" },
  });
  return <form noValidate onSubmit={form.handleSubmit(async (input) => {
    setError(null); setMessage(null);
    try { await onSubmit(input); form.reset(); setMessage(persistent ? "Note saved." : "Note validated. No database is configured."); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save note"); }
  })}>
    <FieldGroup>
      <FormInput control={form.control} name="title" label="Title" description="A title is required." disabled={form.formState.isSubmitting} />
      <FormTextarea control={form.control} name="body" label="Body" disabled={form.formState.isSubmitting} />
      <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Submitting…" : persistent ? "Add note" : "Validate note"}</Button>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
      {message ? <p role="status" className="text-sm text-muted-foreground">{message}</p> : null}
    </FieldGroup>
  </form>;
}
`
    );
  return (
    common +
    `
import { useAppForm } from "./hooks";

export function NotesForm({ onSubmit, persistent = true }: NotesFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const form = useAppForm({
    defaultValues: { title: "", body: "" }, validators: { onSubmit: noteInputSchema },
    onSubmit: async ({ value }) => {
      setError(null); setMessage(null);
      try { await onSubmit(noteInputSchema.parse(value)); form.reset(); setMessage(persistent ? "Note saved." : "Note validated. No database is configured."); }
      catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save note"); }
    },
  });
  return <form noValidate onSubmit={(event) => { event.preventDefault(); event.stopPropagation(); void form.handleSubmit(); }}>
    <form.AppForm><FieldGroup>
      <form.Subscribe selector={(state) => state.isSubmitting}>{(pending) => <>
        <form.AppField name="title">{(field) => <field.Input label="Title" description="A title is required." disabled={pending} />}</form.AppField>
        <form.AppField name="body">{(field) => <field.Textarea label="Body" disabled={pending} />}</form.AppField>
        <Button type="submit" disabled={pending}>{pending ? "Submitting…" : persistent ? "Add note" : "Validate note"}</Button>
      </>}</form.Subscribe>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
      {message ? <p role="status" className="text-sm text-muted-foreground">{message}</p> : null}
    </FieldGroup></form.AppForm>
  </form>;
}
`
  );
}
