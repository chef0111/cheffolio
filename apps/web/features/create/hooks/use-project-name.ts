'use client';

import { debounce, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

import { DEFAULT_PROJECT_NAME } from '../lib/command';

const NAME_DEBOUNCE_MS = 300;

export function useProjectName() {
  const [projectName, setProjectName] = useQueryState('name', {
    defaultValue: DEFAULT_PROJECT_NAME,
    limitUrlUpdates: debounce(NAME_DEBOUNCE_MS),
  });
  const [previewProjectName, setPreviewProjectName] = useState(projectName);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPreviewProjectName(projectName);
    }, NAME_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [projectName]);

  return { projectName, previewProjectName, setProjectName };
}
