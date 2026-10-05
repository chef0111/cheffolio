import { Suspense } from 'react';

import { PanelContent } from '@/components/cheffolio/panel';
import { getGitHubContributions } from '@/features/portfolio/data/github-contributions';

import { GitHubContributionFallback, GitHubContributionGraph } from './graph';

export function GitHubContributions() {
  const contributions = getGitHubContributions();

  return (
    <PanelContent className="screen-line-top decor-t relative mx-auto p-2">
      <h2 className="sr-only">GitHub Contributions</h2>
      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>
    </PanelContent>
  );
}
