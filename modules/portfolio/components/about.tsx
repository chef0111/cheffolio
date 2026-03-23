import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelContent,
} from '@/components/cheffolio/panel';
import { ProseMono } from '@/components/ui/typography';
import { Markdown } from '@/components/cheffolio/markdown';
import { USER } from '../data/user';

export function About() {
  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <ProseMono>
          <Markdown>{USER.about}</Markdown>
        </ProseMono>
      </PanelContent>
    </Panel>
  );
}
