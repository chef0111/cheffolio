import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelContent,
} from '@/components/cheffolio/panel';
import { ProseMono } from '@/components/ui/typography';
import { Markdown } from '@/components/cheffolio/markdown';
import { DecorIcon } from '@/components/cheffolio/decor-icon';
import { GitHubContributions } from './github-contributions';
import { USER } from '../data/user';

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
