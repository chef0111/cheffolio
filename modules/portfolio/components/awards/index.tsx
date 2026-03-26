import { compareDesc } from 'date-fns';

import { CollapsibleList } from '@/components/cheffolio/collapsible-list';

import { AWARDS } from '@/modules/portfolio/data/awards';
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from '@/components/cheffolio/panel';
import { AwardItem } from './award-item';
import { DecorIcon } from '@/components/cheffolio/decor-icon';

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
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />
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
