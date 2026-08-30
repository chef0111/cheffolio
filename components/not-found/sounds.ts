'use client';

import {
  getAudioContext,
  loadAudioBuffer,
  playAudioBuffer,
  unlockAudioContext,
} from '@/lib/web-audio';

export type GameSound = {
  buffer: AudioBuffer | null;
};

export function loadSound(url: string): GameSound {
  const sound: GameSound = { buffer: null };

  void loadAudioBuffer(url)
    .then((buffer) => {
      sound.buffer = buffer;
    })
    .catch(() => {});

  return sound;
}

export function unlockSounds() {
  unlockAudioContext(getAudioContext());
}

export function playSound(sound: GameSound | null, ctx?: AudioContext | null) {
  if (!sound?.buffer) return;

  const audioCtx = ctx ?? getAudioContext();
  if (!audioCtx) return;

  playAudioBuffer(audioCtx, sound.buffer, 0.3);
}
