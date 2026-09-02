import { Markdown } from '@/components/cheffolio/markdown';
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from '@/components/cheffolio/panel';

import { USER } from '../data/user';
import { GitHubContributions } from './github-contributions';

export function About() {
  return (
    <Panel id="about" className="screen-line-bottom-none screen-line-top-none">
      <PanelHeader>
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

      <PanelContent className="typeset typeset-description decor-all -mt-px py-(--typeset-flow)">
        <Markdown>{USER.about}</Markdown>
      </PanelContent>
      <GitHubContributions />
    </Panel>
  );
}
