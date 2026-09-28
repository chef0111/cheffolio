'use client';

import type { PackageManager } from 'create-gb-app/generate';
import type { CreateFlags } from 'create-gb-app/preset';
import { startTransition, useEffect, useRef, useState } from 'react';

import { generatePreview } from '../lib/actions/generate-preview';
import { usePreviewRequestKey } from './use-preview-request-key';

export type PreviewResult = Awaited<ReturnType<typeof generatePreview>>;
export type GeneratedPreview = {
  projectName: string;
  promise: Promise<PreviewResult>;
};

const PREVIEW_CACHE_LIMIT = 20;
const previewCache = new Map<string, Promise<PreviewResult>>();
const previewError = {
  ok: false,
  message: 'Could not generate the preview. Please try again.',
  code: 'unknown',
} as const satisfies PreviewResult;

export function useGeneratedPreview(): GeneratedPreview | null {
  const requestKey = usePreviewRequestKey();
  const [preview, setPreview] = useState<GeneratedPreview | null>(null);
  const hasStartedRequest = useRef(false);

  useEffect(() => {
    const [flags, projectName, packageManager] = JSON.parse(requestKey) as [
      CreateFlags,
      string,
      PackageManager,
    ];

    let promise!: Promise<PreviewResult>;
    startTransition(() => {
      promise = getPreview(requestKey, flags, projectName, packageManager);
    });

    const nextPreview = { projectName, promise };
    // The first update reveals the workspace fallback; later transitions keep the tree visible.
    if (hasStartedRequest.current) {
      startTransition(() => setPreview(nextPreview));
    } else {
      setPreview(nextPreview);
      hasStartedRequest.current = true;
    }
  }, [requestKey]);

  return preview;
}

function getPreview(
  key: string,
  flags: CreateFlags,
  projectName: string,
  packageManager: PackageManager
): Promise<PreviewResult> {
  const cached = previewCache.get(key);
  if (cached) {
    previewCache.delete(key);
    previewCache.set(key, cached);
    return cached;
  }

  const promise = generatePreview(flags, projectName, packageManager).catch(
    () => previewError
  );
  previewCache.set(key, promise);

  if (previewCache.size > PREVIEW_CACHE_LIMIT) {
    const oldestKey = previewCache.keys().next().value;
    if (oldestKey) {
      previewCache.delete(oldestKey);
    }
  }

  return promise;
}
