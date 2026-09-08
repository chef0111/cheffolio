'use client';

import React from 'react';

export type CopyState = 'idle' | 'done' | 'error';

export type UseCopyOptions = {
  onCopySuccess?: (text: string) => void;
  onCopyError?: (error: Error) => void;
  resetDelay?: number;
};

export function useCopy({
  onCopySuccess,
  onCopyError,
  resetDelay = 1500,
}: UseCopyOptions = {}) {
  const [state, setState] = React.useState<CopyState>('idle');
  const resetTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const copy = React.useCallback(
    async (text: string | (() => string)) => {
      // Clear any pending reset
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      try {
        const finalText = typeof text === 'function' ? text() : text;
        await navigator.clipboard.writeText(finalText);

        setState('done');

        onCopySuccess?.(finalText);
      } catch (error) {
        setState('error');

        onCopyError?.(
          error instanceof Error ? error : new Error('Copy failed')
        );
      } finally {
        // Schedule reset to idle
        resetTimeoutRef.current = setTimeout(() => {
          setState('idle');
        }, resetDelay);
      }
    },
    [onCopySuccess, onCopyError, resetDelay]
  );

  return { state, copy } as const;
}
