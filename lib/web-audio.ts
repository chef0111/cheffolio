'use client';

import { toSameOriginAudioUrl } from '@/lib/audio-assets';

type AudioCacheEntry =
  | { kind: 'ready'; buffer: AudioBuffer }
  | { kind: 'pending'; loading: Promise<AudioBuffer> };

const audioCache = new Map<string, AudioCacheEntry | null>();

let sharedAudioContext: AudioContext | null = null;

function audioContextConstructor(): typeof AudioContext | undefined {
  return (
    globalThis.AudioContext ||
    (globalThis as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  );
}

function offlineAudioContextConstructor():
  | typeof OfflineAudioContext
  | undefined {
  return (
    globalThis.OfflineAudioContext ||
    (
      globalThis as unknown as {
        webkitOfflineAudioContext?: typeof OfflineAudioContext;
      }
    ).webkitOfflineAudioContext
  );
}

export function getAudioContext(): AudioContext | null {
  if (sharedAudioContext) {
    if (sharedAudioContext.state !== 'closed') return sharedAudioContext;
    sharedAudioContext = null;
    audioCache.clear();
  }

  const AudioContextClass = audioContextConstructor();
  if (!AudioContextClass) {
    console.warn('Web Audio API is not supported in this browser.');
    return null;
  }

  try {
    sharedAudioContext = new AudioContextClass();
    return sharedAudioContext;
  } catch {
    return null;
  }
}

export function resumeAudioContext(ctx: AudioContext | null | undefined) {
  if (!ctx || ctx.state === 'running' || ctx.state === 'closed') return;
  void ctx.resume();
}

export function unlockAudioContext(ctx: AudioContext | null | undefined) {
  if (!ctx || ctx.state === 'closed') return;

  resumeAudioContext(ctx);

  try {
    const silent = ctx.createBuffer(1, 1, ctx.sampleRate || 22050);
    const source = ctx.createBufferSource();
    source.buffer = silent;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    return;
  }
}

function decodeAudioBytes(data: ArrayBuffer): Promise<AudioBuffer> {
  if (sharedAudioContext && sharedAudioContext.state !== 'closed') {
    return sharedAudioContext.decodeAudioData(data.slice(0));
  }

  const OfflineAudioContextClass = offlineAudioContextConstructor();
  if (OfflineAudioContextClass) {
    const offline = new OfflineAudioContextClass(1, 1, 44100);
    return offline.decodeAudioData(data.slice(0));
  }

  const ctx = getAudioContext();
  if (!ctx) {
    return Promise.reject(new Error('Web Audio API not supported'));
  }
  return ctx.decodeAudioData(data.slice(0));
}

export function playAudioBuffer(
  ctx: AudioContext,
  buffer: AudioBuffer,
  volume: number
) {
  resumeAudioContext(ctx);

  const source = ctx.createBufferSource();
  const gainNode = ctx.createGain();

  source.buffer = buffer;
  gainNode.gain.value = volume;

  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start(0);
}

export function loadAudioBuffer(url: string): Promise<AudioBuffer> {
  const src = toSameOriginAudioUrl(url);
  const cached = audioCache.get(src);
  if (cached?.kind === 'ready') return Promise.resolve(cached.buffer);
  if (cached?.kind === 'pending') return cached.loading;

  const loadingPromise = fetch(src)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch ${src}`);
      }
      return res.arrayBuffer();
    })
    .then((data) => decodeAudioBytes(data))
    .then((decoded) => {
      audioCache.set(src, { kind: 'ready', buffer: decoded });
      return decoded;
    })
    .catch((err) => {
      console.log(`Failed to load sound from ${src}:`, err);
      audioCache.set(src, null);
      throw err;
    });

  audioCache.set(src, { kind: 'pending', loading: loadingPromise });
  return loadingPromise;
}

export function getCachedAudioBuffer(url: string): AudioBuffer | null {
  const cached = audioCache.get(toSameOriginAudioUrl(url));
  return cached?.kind === 'ready' ? cached.buffer : null;
}
