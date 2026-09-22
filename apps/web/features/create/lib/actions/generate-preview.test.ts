import { expect, test } from 'bun:test';

import { YES_DEFAULTS } from '../compat';
import { generatePreview } from './generate-preview';

test('generatePreview rejects invalid flags', async () => {
  const result = await generatePreview(
    { frontend: 'next' } as never,
    'my-gb-app'
  );
  expect(result).toEqual({
    ok: false,
    message: 'invalid flags',
    code: 'invalid',
  });
});

test('generatePreview returns the YES tree', async () => {
  const result = await generatePreview(YES_DEFAULTS, 'my-gb-app');
  expect(result.ok).toBe(true);
  if (!result.ok) {
    return;
  }
  expect(Object.keys(result.files)).toContain('package.json');
  expect(Object.keys(result.files)).toContain('README.md');
  expect(Object.keys(result.files).length).toBe(32);
});
