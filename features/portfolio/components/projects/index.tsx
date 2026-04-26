import { CollapsibleList } from '@/components/cheffolio/collapsible-list';
import { DecorIcon } from '@/components/cheffolio/decor-icon';
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from '@/components/cheffolio/panel';
import { PROJECTS } from '@/features/portfolio/data/projects';

import { ProjectItem } from './project-item';

export function Projects() {
  return (
    <Panel id="projects">
      <PanelHeader>
        <PanelTitle>
          Projects
          <PanelTitleSup>({PROJECTS.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="relative px-0 py-px">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="mb-px size-4" position="bottom-left" />
        <DecorIcon className="mb-px size-4" position="bottom-right" />
        <CollapsibleList
          items={PROJECTS}
          max={5}
          renderItem={(item) => <ProjectItem project={item} />}
        />
      </PanelContent>
    </Panel>
  );
}
