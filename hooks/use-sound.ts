'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getAudioContext,
  getCachedAudioBuffer,
  loadAudioBuffer,
  playAudioBuffer,
  unlockAudioContext,
} from '@/lib/web-audio';

/**
 * Custom React hook to load and play a sound from a given URL using the Web Audio API.
 *
 * This hook implements caching to prevent duplicate network requests and memory usage
 * when the same audio file is used across multiple components.
 *
 * @param url - The URL of the audio file to load and play.
 * @returns A function that, when called, plays the loaded sound.
 *
 * @remarks
 * - Audio buffers are cached globally, so the same file is only loaded once
 * - Uses a shared AudioContext to avoid resource exhaustion
 * - If the Web Audio API is not supported in the browser, a warning is logged and playback is disabled
 * - Errors during fetching or decoding the audio are logged to the console
 *
 * @example
 * ```tsx
 * const playClick = useSound('/sounds/click.mp3');
 * // Later in an event handler:
 * playClick();
 * ```
 */
export function useSound(url: string) {
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    void loadAudioBuffer(url)
      .then((decoded) => {
        bufferRef.current = decoded;
      })
      .catch(() => {});
  }, [url]);

  const play = useCallback((volume: number = 1) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    unlockAudioContext(ctx);

    if (bufferRef.current) {
      playAudioBuffer(ctx, bufferRef.current, volume);
    }
  }, []);

  return play;
}

/**
 * Custom React hook for lazy loading and playing sounds with manual preload control.
 *
 * Unlike `useSound()`, this hook does NOT load audio on mount. Audio is only fetched when:
 * - `preload()` is manually called (e.g., on hover)
 * - `play()` is called and audio is not yet loaded (auto-load fallback)
 *
 * This is ideal for audio that may not be needed by most users, saving initial bandwidth and memory.
 *
 * @param url - The URL of the audio file to load and play.
 * @returns Object with play function, preload function, and loading states.
 *
 * @remarks
 * - Audio buffers are cached globally and shared with `useSound()`
 * - Uses a shared AudioContext to avoid resource exhaustion
 * - If the Web Audio API is not supported, warnings are logged and playback is disabled
 * - Errors during fetching or decoding the audio are logged to the console
 *
 * @example
 * ```tsx
 * const { play, preload, isLoading, isLoaded } = useSoundLazy('/sounds/rare.mp3');
 *
 * // Preload on hover for instant playback on click
 * <button
 *   onPointerEnter={() => preload()}
 *   onClick={() => play()}
 * >
 *   Play Sound
 * </button>
 * ```
 */
export function useSoundLazy(url: string) {
  const bufferRef = useRef<AudioBuffer | null>(null);
  const loadingPromiseRef = useRef<Promise<AudioBuffer | void> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(() => !!getCachedAudioBuffer(url));

  useEffect(() => {
    const cached = getCachedAudioBuffer(url);
    if (cached) {
      bufferRef.current = cached;
    }
  }, [url]);

  const load = useCallback(() => {
    if (bufferRef.current) {
      return Promise.resolve(bufferRef.current);
    }

    if (loadingPromiseRef.current) {
      return loadingPromiseRef.current;
    }

    setIsLoading(true);
    const promise = loadAudioBuffer(url)
      .then((decoded) => {
        bufferRef.current = decoded;
        setIsLoaded(true);
        return decoded;
      })
      .finally(() => {
        setIsLoading(false);
        loadingPromiseRef.current = null;
      });

    loadingPromiseRef.current = promise;
    return promise;
  }, [url]);

  const preload = useCallback(() => {
    load().catch(() => {});
  }, [load]);

  const play = useCallback(
    (volume: number = 1) => {
      const ctx = getAudioContext();
      if (ctx) {
        unlockAudioContext(ctx);
      }

      const playNow = () => {
        const ready = getAudioContext();
        if (ready && bufferRef.current) {
          playAudioBuffer(ready, bufferRef.current, volume);
          return true;
        }
        return false;
      };

      if (playNow()) return;

      void load().then(() => {
        playNow();
      });
    },
    [load]
  );

  return { play, preload, isLoading, isLoaded };
}
