import { Markdown } from '@/components/cheffolio/markdown';
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelPlus,
  PanelTitle,
} from '@/components/cheffolio/panel';

import { USER } from '../data/user';
import { GitHubContributions } from './github-contributions';

export function About() {
  return (
    <Panel id="about" className="screen-line-bottom-none">
      <PanelHeader className="relative">
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

      <PanelContent className="typeset typeset-description relative py-(--typeset-flow)">
        <Markdown>{USER.about}</Markdown>
        <PanelPlus position="top-left" />
        <PanelPlus position="top-right" />
        <PanelPlus position="bottom-left" />
        <PanelPlus position="bottom-right" />
      </PanelContent>
      <GitHubContributions />
    </Panel>
  );
}
