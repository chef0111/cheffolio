import { DecorIcon } from '@/components/cheffolio/decor-icon';
import { Markdown } from '@/components/cheffolio/markdown';
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from '@/components/cheffolio/panel';
import { Prose } from '@/components/ui/typography';

import { USER } from '../data/user';
import { GitHubContributions } from './github-contributions';

export function About() {
  return (
    <Panel id="about" className="relative">
      <DecorIcon className="mb-px size-4" position="bottom-left" />
      <DecorIcon className="mb-px size-4" position="bottom-right" />

      <PanelHeader className="relative">
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

      <PanelContent className="relative">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />
        <Prose>
          <Markdown>{USER.about}</Markdown>
        </Prose>
      </PanelContent>
      <GitHubContributions />
    </Panel>
  );
}
