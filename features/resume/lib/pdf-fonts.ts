import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { FontLoader } from 'takumi-pdf';

import { RESUME_FONT_FAMILY } from '@/config/resume';

const FONT_DIR = join(process.cwd(), 'assets/fonts/cmu-serif');

function loadFace(
  file: string,
  weight: 400 | 700,
  style: 'normal' | 'italic'
): FontLoader {
  return {
    name: RESUME_FONT_FAMILY,
    data: readFileSync(join(FONT_DIR, file)),
    weight,
    style,
  };
}

// Read once at module load so every render reuses the same bytes.
export const resumeFonts: FontLoader[] = [
  loadFace('cmunrm.otf', 400, 'normal'),
  loadFace('cmunbx.otf', 700, 'normal'),
  loadFace('cmunti.otf', 400, 'italic'),
  loadFace('cmunbi.otf', 700, 'italic'),
];
