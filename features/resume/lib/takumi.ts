import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { initSync, measure, render } from 'takumi-pdf/no-init';

const require = createRequire(import.meta.url);

initSync({
  module: readFileSync(require.resolve('takumi-pdf/takumi_pdf_wasm_bg.wasm')),
});

export { measure, render };
