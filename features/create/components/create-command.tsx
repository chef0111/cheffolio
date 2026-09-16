'use client';

import {
  CodeBlockCommand,
  convertNpmCommand,
} from '@/components/code-block-command';

import { useCreate } from './create-provider';

export function CreateCommand() {
  const { command } = useCreate();

  return <CodeBlockCommand {...convertNpmCommand(command)} />;
}
