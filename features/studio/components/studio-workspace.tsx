'use client';

import { Panel } from '@/components/cheffolio/panel';

import { StudioCommand } from './studio-command';
import { StudioPicker } from './studio-picker';
import { StudioProvider } from './studio-provider';
import { StudioTree } from './studio-tree';

export function StudioWorkspace() {
  return (
    <StudioProvider>
      <Panel className="screen-line-bottom-none p-0">
        <StudioCommand />
      </Panel>
      <Panel className="screen-line-top-none p-0">
        <div className="grid md:grid-cols-2">
          <div className="border-border md:border-r">
            <StudioPicker />
          </div>
          <StudioTree />
        </div>
      </Panel>
    </StudioProvider>
  );
}
