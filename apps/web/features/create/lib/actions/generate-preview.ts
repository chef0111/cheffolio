'use server';

import type { CreateFlags } from 'create-gb-app/preset';

import { normalizeFlags } from '../compat';
import {
  buildCreateFileMap,
  type CreateFileMapResult,
  isCreateFlags,
} from '../generate-files';

export async function generatePreview(
  flags: CreateFlags,
  projectName: string
): Promise<CreateFileMapResult> {
  if (!isCreateFlags(flags) || typeof projectName !== 'string') {
    return { ok: false, message: 'invalid flags', code: 'invalid' };
  }

  return buildCreateFileMap(normalizeFlags(flags), projectName);
}
