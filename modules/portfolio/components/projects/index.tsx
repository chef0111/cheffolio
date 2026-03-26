import { CollapsibleList } from '@/components/cheffolio/collapsible-list';

import { ProjectItem } from './project-item';
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from '@/components/cheffolio/panel';
import { DecorIcon } from '@/components/cheffolio/decor-icon';
import { PROJECTS } from '@/modules/portfolio/data/projects';

export function Projects() {
  return (
    <Panel id="projects">
      <PanelHeader>
        <PanelTitle>
          Projects
          <PanelTitleSup>({PROJECTS.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="relative px-0 py-0.5">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />
        <CollapsibleList
          items={PROJECTS}
          max={5}
          renderItem={(item) => <ProjectItem project={item} />}
        />
      </PanelContent>
    </Panel>
  );
}
