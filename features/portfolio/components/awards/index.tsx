import { compareDesc } from 'date-fns';

import { CollapsibleList } from '@/components/cheffolio/collapsible-list';
import { DecorIcon } from '@/components/cheffolio/decor-icon';
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from '@/components/cheffolio/panel';
import { AWARDS } from '@/features/portfolio/data/awards';

import { AwardItem } from './award-item';

const SORTED_AWARDS = [...AWARDS].sort((a, b) => {
  return compareDesc(new Date(a.date), new Date(b.date));
});

export function Awards() {
  return (
    <Panel id="awards">
      <PanelHeader>
        <PanelTitle>
          Honors & Awards
          <PanelTitleSup>({AWARDS.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="relative p-0">
        <DecorIcon className="mb-px size-4" position="bottom-left" />
        <DecorIcon className="mb-px size-4" position="bottom-right" />
        <CollapsibleList
          items={SORTED_AWARDS}
          max={3}
          keyExtractor={(item) => item.id}
          renderItem={(item) => <AwardItem className="relative" award={item} />}
        />
      </PanelContent>
    </Panel>
  );
}
