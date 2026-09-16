'use client';

import { CodeBlockCommand } from '@/components/code-block-command';
import { convertNpmCommand } from '@/lib/convert-npm-command';

import { useCreate } from './create-provider';

export function CreateCommand() {
  const { command } = useCreate();

  return <CodeBlockCommand {...convertNpmCommand(command)} />;
}
