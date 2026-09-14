import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { FontLoader } from 'takumi-pdf';

import { RESUME_FONT_FAMILY } from './constants';

const FONT_DIR = join(process.cwd(), 'assets/fonts/latin-modern');

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
  loadFace('lmroman10-regular.otf', 400, 'normal'),
  loadFace('lmroman10-bold.otf', 700, 'normal'),
  loadFace('lmroman10-italic.otf', 400, 'italic'),
  loadFace('lmroman10-bolditalic.otf', 700, 'italic'),
];
