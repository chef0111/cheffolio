import { Suspense } from 'react';

import { DecorIcon } from '@/components/cheffolio/decor-icon';
import { Panel } from '@/components/cheffolio/panel';
import { getGitHubContributions } from '@/modules/portfolio/data/github-contributions';

import { GitHubContributionFallback, GitHubContributionGraph } from './graph';

export function GitHubContributions() {
  const contributions = getGitHubContributions();

  return (
    <Panel className="relative mx-auto">
      <DecorIcon className="size-4" position="top-left" />
      <DecorIcon className="size-4" position="top-right" />
      <DecorIcon className="size-4" position="bottom-left" />
      <DecorIcon className="size-4" position="bottom-right" />
      <h2 className="sr-only">GitHub Contributions</h2>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>
    </Panel>
  );
}
