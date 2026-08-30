import { expect, mock, test } from 'bun:test';

import { playAudioBuffer, resumeAudioContext } from '@/lib/web-audio';

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

test('resumeAudioContext resumes a suspended context without awaiting', () => {
  const { ctx, resume } = mockContext('suspended');
  resumeAudioContext(ctx);
  expect(resume).toHaveBeenCalledTimes(1);
});

test('resumeAudioContext resumes an interrupted context', () => {
  const { ctx, resume } = mockContext('interrupted');
  resumeAudioContext(ctx);
  expect(resume).toHaveBeenCalledTimes(1);
});

test('resumeAudioContext is a no-op when the context is already running', () => {
  const { ctx, resume } = mockContext('running');
  resumeAudioContext(ctx);
  expect(resume).not.toHaveBeenCalled();
});

test('playAudioBuffer starts a source in the same turn even if resume() never settles', () => {
  const { ctx, resume, start } = mockContext('suspended');
  resume.mockImplementation(() => new Promise(() => {}));

  playAudioBuffer(ctx, {} as AudioBuffer, 0.3);

  expect(resume).toHaveBeenCalledTimes(1);
  expect(start).toHaveBeenCalledWith(0);
});
