import { expect, test } from 'bun:test';

import { YES_DEFAULTS } from './compat';
import { generateCreateFiles } from './generate-create-files';

test('generateCreateFiles rejects invalid flags', async () => {
  const result = await generateCreateFiles(
    { frontend: 'next' } as never,
    'my-gb-app'
  );
  expect(result).toEqual({
    ok: false,
    message: 'invalid flags',
    code: 'invalid',
  });
});

test('generateCreateFiles returns the YES tree', async () => {
  const result = await generateCreateFiles(YES_DEFAULTS, 'my-gb-app');
  expect(result.ok).toBe(true);
  if (!result.ok) {
    return;
  }
  expect(Object.keys(result.files)).toContain('package.json');
  expect(Object.keys(result.files)).toContain('README.md');
  expect(Object.keys(result.files).length).toBe(32);
});
