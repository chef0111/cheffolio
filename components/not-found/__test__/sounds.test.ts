import { expect, mock, test } from 'bun:test';

import { playSound, unlockSounds } from '@/components/not-found/sounds';

function mockContext(state: AudioContextState) {
  const start = mock(() => {});
  const connect = mock(() => {});
  const resume = mock(() => Promise.resolve());
  const ctx = {
    state,
    resume,
    destination: {},
    createBufferSource: () => ({
      buffer: null as AudioBuffer | null,
      connect,
      start,
    }),
    createGain: () => ({
      gain: { value: 1 },
      connect,
    }),
  } as unknown as AudioContext;

  return { ctx, resume, start };
}

test('unlockSounds does not throw without a prior AudioContext', () => {
  unlockSounds();
});

test('playSound starts a buffer source without HTMLAudioElement.play()', () => {
  const { ctx, start } = mockContext('suspended');

  playSound({ buffer: {} as AudioBuffer }, ctx);

  expect(start).toHaveBeenCalledWith(0);
});

test('playSound is a no-op when the buffer has not decoded', () => {
  const { ctx, start } = mockContext('running');

  playSound({ buffer: null }, ctx);

  expect(start).not.toHaveBeenCalled();
});
