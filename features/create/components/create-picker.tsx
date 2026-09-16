'use client';

import { useId } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { FLAG_GROUP_LABELS, FLAG_OPTIONS } from '../data/options';
import { isSelectable } from '../lib/command';
import { disabledReason, isGroupVisible } from '../lib/compat';
import { type CreateFlags, FLAG_GROUPS, type FlagGroup } from '../types/stack';
import { useCreate } from './create-provider';

export function CreatePicker() {
  const { flags } = useCreate();

  return (
    <Card className="rounded-none ring-0">
      <CardHeader className="border-b">
        <CardTitle>Stack</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6">
          {FLAG_GROUPS.map((group) =>
            isGroupVisible(flags, group) ? (
              <FlagRadioGroup key={group} group={group} />
            ) : null
          )}
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

function FlagRadioGroup({ group }: { group: FlagGroup }) {
  const id = useId();
  const { flags, setFlag } = useCreate();
  const selected = flags[group];

  return (
    <FieldSet>
      <FieldLegend variant="label">{FLAG_GROUP_LABELS[group]}</FieldLegend>
      <RadioGroup
        value={selected}
        onValueChange={(value) => {
          assignFlag(group, value, flags, setFlag);
        }}
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {FLAG_OPTIONS[group].map((option) => {
          const optionId = `${id}-${option.value}`;
          const enabled = isSelectable(flags, group, option.value);
          const reason = disabledReason(flags, group, option.value);

          return (
            <FieldLabel
              key={option.value}
              htmlFor={optionId}
              className={enabled ? undefined : 'cursor-not-allowed opacity-60'}
            >
              <Field
                orientation="horizontal"
                data-disabled={!enabled || undefined}
              >
                <RadioGroupItem
                  id={optionId}
                  value={option.value}
                  disabled={!enabled}
                />
                <FieldContent>
                  <FieldTitle>{option.label}</FieldTitle>
                  {reason ? (
                    <FieldDescription>{reason}</FieldDescription>
                  ) : null}
                </FieldContent>
              </Field>
            </FieldLabel>
          );
        })}
      </RadioGroup>
    </FieldSet>
  );
}

function assignFlag(
  group: FlagGroup,
  value: unknown,
  flags: CreateFlags,
  setFlag: <K extends FlagGroup>(key: K, value: CreateFlags[K]) => void
) {
  if (typeof value !== 'string') {
    return;
  }
  if (!isSelectable(flags, group, value)) {
    return;
  }
  setFlag(group, value as CreateFlags[typeof group]);
}
