import { Markdown } from '@/components/app/markdown';
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from '@/components/app/panel';

import { USER } from '../data/user';
import { GitHubContributions } from './github-contributions';

export function About() {
  return (
    <Panel id="about" className="screen-line-bottom-none screen-line-top-none">
      <PanelHeader className="decor-b">
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

      <PanelContent className="typeset typeset-description py-(--typeset-flow)">
        <Markdown>{USER.about}</Markdown>
      </PanelContent>
      <GitHubContributions />
    </Panel>
  );
}
