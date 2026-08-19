import { DecorIcon } from '@/components/cheffolio/decor-icon';
import { Panel, PanelHeader, PanelTitle } from '@/components/cheffolio/panel';

import { TECH_STACK } from '../data/tech-stack';
import type { TechStack as TechStackType } from '../types/tech-stack';

const ID = 'stack';

export function TechStack() {
  return (
    <Panel id={ID} className="screen-line-bottom-none">
      <PanelHeader>
        <PanelTitle>Tech Stack</PanelTitle>
      </PanelHeader>

      <div className="relative [--badge-height:--spacing(6)] [--col-left-width:--spacing(48)]">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />

        <div
          className="pointer-events-none absolute inset-y-0 left-(--col-left-width) -z-1 w-px bg-[linear-gradient(to_bottom,var(--line)_4px,transparent_2px)] bg-size-[1px_6px] bg-repeat-y max-sm:hidden"
          aria-hidden
        />

        {Object.entries(groupByCategory(TECH_STACK)).map(
          ([category, items], index) => {
            const categoryId = `${ID}-${category
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')}`;

            return (
              <div
                key={category}
                className="border-line grid items-start gap-y-2 border-b py-4 last:border-none sm:grid-cols-[var(--col-left-width)_1fr]"
              >
                <div
                  id={categoryId}
                  className="text-muted-foreground pl-4 text-sm/(--badge-height)"
                >
                  <span
                    className="text-muted-foreground/50 mr-1.5 font-mono select-none"
                    aria-hidden
                  >
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  {category}
                </div>

                <ul
                  aria-labelledby={categoryId}
                  className="flex flex-wrap gap-1.5 px-4"
                >
                  {items.map((item) => {
                    return (
                      <li key={item.key} className="flex">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener"
                          className="text-foreground inset-ring-border [&_svg]:text-muted-foreground/80 flex h-(--badge-height) items-center justify-center gap-1 rounded-full bg-zinc-50/80 px-2 font-mono text-xs inset-ring-1 dark:bg-zinc-900/80 [&_svg]:pointer-events-none [&_svg]:h-3.5 [&_svg]:w-4 [&_svg]:shrink-0"
                        >
                          {item.icon}
                          {item.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }
        )}
      </div>
    </Panel>
  );
}

function groupByCategory(
  items: TechStackType[]
): Record<string, TechStackType[]> {
  return items.reduce<Record<string, TechStackType[]>>((acc, item) => {
    for (const category of item.categories) {
      (acc[category] ??= []).push(item);
    }
    return acc;
  }, {});
}
