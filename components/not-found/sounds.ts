import { coinCollectSound } from '@/lib/soundcn/coin-collect';
import { jump8bitSound } from '@/lib/soundcn/jump-8bit';
import {
  decodeAudioData,
  getAudioContext,
  playSound as playSoundDataUri,
} from '@/lib/soundcn/sound-engine';
import type { SoundAsset } from '@/lib/soundcn/sound-types';
import { threeTone1Sound } from '@/lib/soundcn/three-tone-1';

export const GAME_SOUNDS = {
  bounce: jump8bitSound,
  break: coinCollectSound,
  gameOver: threeTone1Sound,
} as const;

const DEFAULT_VOLUME = 0.3;

export function preloadSounds() {
  return Promise.all(
    Object.values(GAME_SOUNDS).map((sound) => decodeAudioData(sound.dataUri))
  );
}

/**
 * Resume AudioContext and prime a silent buffer source inside the user gesture.
 * Required on iOS/Android: pointerdown-only (slider drag) is not enough.
 */
export async function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  await preloadSounds();

  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  const silent = ctx.createBuffer(1, 1, ctx.sampleRate);
  source.buffer = silent;
  gain.gain.value = 0;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);
}

export function playSound(sound: SoundAsset, volume = DEFAULT_VOLUME) {
  void playSoundDataUri(sound.dataUri, { volume });
}
