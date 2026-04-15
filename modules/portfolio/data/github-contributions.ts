import { cacheLife, cacheTag } from 'next/cache';

import type { Activity } from '@/components/kibo-ui/contribution-graph';
import { GITHUB_USERNAME } from '@/config/site';

type GitHubContributionsResponse = {
  contributions: Activity[];
};

const isActivity = (value: unknown): value is Activity => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.date === 'string' &&
    typeof record.count === 'number' &&
    typeof record.level === 'number'
  );
};

const normalizeContributions = (value: unknown): Activity[] => {
  if (Array.isArray(value)) {
    return value.filter(isActivity);
  }

  if (typeof value !== 'object' || value === null) {
    return [];
  }

  const record = value as Record<string, unknown>;

  if (Array.isArray(record.contributions)) {
    return record.contributions.filter(isActivity);
  }

  return [];
};

export const getGitHubContributions = async () => {
  'use cache';

  cacheTag('github-contributions');
  cacheLife({
    revalidate: 3600, // Cache for 1 hour
  });

  if (!process.env.GITHUB_CONTRIBUTIONS_API) {
    return [];
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(
        `${process.env.GITHUB_CONTRIBUTIONS_API}/v4/${GITHUB_USERNAME}?y=last`,
        {
          headers: {
            'cache-control': 'no-cache',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        return [];
      }

      const data = (await res.json()) as GitHubContributionsResponse | Activity[];

      return normalizeContributions(data);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('GitHub contributions fetch timed out after 5000ms');
      return [];
    }
    return [];
  }
};
