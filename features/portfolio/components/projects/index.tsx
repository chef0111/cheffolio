import { CollapsibleList } from '@/components/cheffolio/collapsible-list';
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
    <Panel
      id="projects"
      className="screen-line-bottom-none screen-line-top-none"
    >
      <PanelHeader>
        <PanelTitle>
          Projects
          <PanelTitleSup>({PROJECTS.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="decor-t flow-root p-0">
        <CollapsibleList
          items={PROJECTS}
          max={3}
          triggerClassName="mt-2"
          keyExtractor={(item) => item.id}
          renderItem={(item) => <ProjectItem project={item} />}
        />
      </PanelContent>
    </Panel>
  );
}
