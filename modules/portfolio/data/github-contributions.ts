import { cacheLife, cacheTag } from 'next/cache';

import type { Activity } from '@/components/kibo-ui/contribution-graph';
import { GITHUB_USERNAME } from '@/config/site';

type GitHubContributionsResponse = {
  contributions: Activity[];
};

export const getGitHubContributions = async () => {
  'use cache';

  const res = await fetch(
    `${process.env.GITHUB_CONTRIBUTIONS_API}/v4/${GITHUB_USERNAME}?y=last`
  );
  const data = (await res.json()) as GitHubContributionsResponse;

  cacheTag('github-contributions');
  cacheLife({
    revalidate: 3600, // Cache for 1 hour
  });

  return data.contributions;
};
