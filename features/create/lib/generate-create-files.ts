'use server';

import type { CreateFlags } from '../types/stack';
import { normalizeFlags } from './compat';
import {
  buildCreateFileMap,
  type CreateFileMapResult,
  isCreateFlags,
} from './generate-files';

export async function generateCreateFiles(
  flags: CreateFlags,
  projectName: string
): Promise<CreateFileMapResult> {
  if (!isCreateFlags(flags) || typeof projectName !== 'string') {
    return { ok: false, message: 'invalid flags', code: 'invalid' };
  }

  return buildCreateFileMap(normalizeFlags(flags), projectName);
}
