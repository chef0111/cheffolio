import { Suspense } from 'react';

import { getGitHubContributions } from '@/features/portfolio/data/github-contributions';

import { GitHubContributionFallback, GitHubContributionGraph } from './graph';

export function GitHubContributions() {
  const contributions = getGitHubContributions();

  return (
    <div className="screen-line-top relative mx-auto">
      <h2 className="sr-only">GitHub Contributions</h2>
      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>
    </div>
  );
}
