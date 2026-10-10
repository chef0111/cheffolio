'use client';

import type { CreateFlags } from 'create-gb-app/preset';

import type { PackageManager } from '@/components/ncdai/code-block-command';
import { usePackageManager } from '@/components/ncdai/code-block-command';

import { useCreate } from '../components/create-provider';

function previewKey(
  flags: CreateFlags,
  projectName: string,
  packageManager: PackageManager
) {
  return JSON.stringify([flags, projectName, packageManager]);
}

export function usePreviewRequestKey() {
  const { flags, previewProjectName } = useCreate();
  const [selectedManager] = usePackageManager();
  const packageManager = selectedManager === 'prompt' ? 'bun' : selectedManager;

  return previewKey(flags, previewProjectName, packageManager);
}
