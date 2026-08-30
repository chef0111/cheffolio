import { expect, test } from 'bun:test';

import {
  resolveAudioAssetUrl,
  toSameOriginAudioUrl,
} from '@/lib/audio-assets';

test('toSameOriginAudioUrl rewrites the assets CDN to the app route', () => {
  expect(
    toSameOriginAudioUrl('https://assets.giabao.dev/sounds/toggle.mp3')
  ).toBe('/api/audio/sounds/toggle.mp3');
  expect(toSameOriginAudioUrl('/local.mp3')).toBe('/local.mp3');
});

test('resolveAudioAssetUrl maps safe audio paths to the CDN', () => {
  expect(resolveAudioAssetUrl(['sounds', 'toggle.mp3'])).toBe(
    'https://assets.giabao.dev/sounds/toggle.mp3'
  );
});

test('resolveAudioAssetUrl rejects traversal and non-audio files', () => {
  expect(resolveAudioAssetUrl(['..', 'secrets.txt'])).toBeNull();
  expect(resolveAudioAssetUrl(['sounds', 'toggle.exe'])).toBeNull();
  expect(resolveAudioAssetUrl([])).toBeNull();
});
