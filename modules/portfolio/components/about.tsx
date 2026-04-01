import { DecorIcon } from '@/components/cheffolio/decor-icon';
import { Markdown } from '@/components/cheffolio/markdown';
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from '@/components/cheffolio/panel';
import { ProseMono } from '@/components/ui/typography';

import { USER } from '../data/user';
import { GitHubContributions } from './github-contributions';

export function About() {
  return (
    <Panel id="about">
      <PanelHeader className="relative">
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

      <PanelContent className="relative">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <ProseMono>
          <Markdown>{USER.about}</Markdown>
        </ProseMono>
      </PanelContent>
      <GitHubContributions />
    </Panel>
  );
}
