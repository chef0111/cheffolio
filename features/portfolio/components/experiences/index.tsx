import React from 'react';

import { DecorIcon } from '@/components/cheffolio/decor-icon';
import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from '@/components/cheffolio/panel';
import { EXPERIENCES } from '@/features/portfolio/data/experiences';

import { ExperienceItem } from './experience-item';

export function Experiences() {
  return (
    <Panel
      id="experience"
      className="screen-line-bottom-none screen-line-top-none relative"
    >
      <DecorIcon className="size-4" position="bottom-left" />
      <DecorIcon className="size-4" position="bottom-right" />

      <PanelHeader>
        <PanelTitle>Experience</PanelTitle>
      </PanelHeader>

      <PanelContent className="p-0">
        <div>
          {EXPERIENCES.map((experience, index) => (
            <React.Fragment key={experience.id}>
              <ExperienceItem experience={experience} />
              {index !== EXPERIENCES.length - 1 && (
                <FullWidthDivider className="bg-border" />
              )}
            </React.Fragment>
          ))}
        </div>
      </PanelContent>
    </Panel>
  );
}
