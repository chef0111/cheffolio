import { compareDesc } from 'date-fns';

import { CollapsibleList } from '@/components/cheffolio/collapsible-list';
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
    <Panel id="awards" className="screen-line-bottom-none screen-line-top-none">
      <PanelHeader className="-mt-px">
        <PanelTitle>
          Honors & Awards
          <PanelTitleSup>({AWARDS.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="decor-t p-0">
        <CollapsibleList
          items={SORTED_AWARDS}
          max={3}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <AwardItem className="border-border border-t" award={item} />
          )}
        />
      </PanelContent>
    </Panel>
  );
}
