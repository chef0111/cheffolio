import Image from 'next/image';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { TECH_STACK } from '../data/tech-stack';
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelContent,
} from '@/components/cheffolio/panel';
import { DecorIcon } from '@/components/cheffolio/decor-icon';

export function TechStack() {
  const baseUrl = 'https://res.cloudinary.com/dpuqj2n2q/image/upload';

  return (
    <Panel id="stack">
      <PanelHeader>
        <PanelTitle>Tech Stack</PanelTitle>
      </PanelHeader>

      <PanelContent className="relative">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />

        <ul className="flex flex-wrap gap-4 select-none">
          {TECH_STACK.map((tech) => {
            return (
              <li key={tech.key} className="flex">
                <Tooltip>
                  <TooltipTrigger>
                    <a
                      href={tech.href}
                      target="_blank"
                      rel="noopener"
                      aria-label={tech.title}
                    >
                      {tech.theme ? (
                        <>
                          <Image
                            src={`${baseUrl}/${tech.key}-light.svg`}
                            alt={`${tech.title} light icon`}
                            width={32}
                            height={32}
                            className="hidden size-8 object-cover [html.light_&]:block"
                          />
                          <Image
                            src={`${baseUrl}/${tech.key}-dark.svg`}
                            alt={`${tech.title} dark icon`}
                            width={32}
                            height={32}
                            className="hidden size-8 object-cover [html.dark_&]:block"
                          />
                        </>
                      ) : (
                        <Image
                          src={`${baseUrl}/${tech.key}.svg`}
                          alt={`${tech.title} icon`}
                          width={32}
                          height={32}
                          className="size-8 object-cover"
                        />
                      )}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tech.title}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </PanelContent>
    </Panel>
  );
}
