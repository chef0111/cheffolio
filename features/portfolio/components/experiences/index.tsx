import { DecorIcon } from '@/components/cheffolio/decor-icon';
import { Panel, PanelHeader, PanelTitle } from '@/components/cheffolio/panel';
import { EXPERIENCES } from '@/features/portfolio/data/experiences';

import { ExperienceItem } from './experience-item';

export function Experiences() {
  return (
    <Panel id="experience" className="relative">
      <DecorIcon className="size-4" position="bottom-left" />
      <DecorIcon className="size-4" position="bottom-right" />

      <PanelHeader>
        <PanelTitle>Experience</PanelTitle>
      </PanelHeader>

      <div>
        {EXPERIENCES.map((experience) => (
          <ExperienceItem key={experience.id} experience={experience} />
        ))}
      </div>
    </Panel>
  );
}
