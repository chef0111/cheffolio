import Image from 'next/image';

import { DecorIcon } from '@/components/cheffolio/decor-icon';
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from '@/components/kibo-ui/status';
import { UTM_PARAMS } from '@/config/site';
import type { Experience } from '@/features/portfolio/types/experiences';
import { addQueryParams } from '@/utils/url';

import { ExperiencePositionItem } from './position-item';

export function ExperienceItem({ experience }: { experience: Experience }) {
  return (
    <div
      id={`experience-${experience.id}`}
      className="screen-line-bottom relative scroll-mt-14 space-y-4 py-4 pr-2 pl-4"
    >
      <DecorIcon className="size-4" position="top-left" />
      <DecorIcon className="size-4" position="top-right" />

      <div className="flex items-center gap-3">
        <div className="flex size-6 shrink-0 items-center justify-center select-none">
          {experience.companyLogo ? (
            <Image
              src={experience.companyLogo}
              alt={`${experience.companyName} logo`}
              width={24}
              height={24}
              quality={100}
              className="rounded-full"
              unoptimized
              aria-hidden
            />
          ) : (
            <span className="flex size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          )}
        </div>

        <h3 className="text-lg leading-snug font-semibold">
          {experience.companyWebsite ? (
            <a
              className="underline-offset-4 hover:underline"
              href={addQueryParams(experience.companyWebsite, UTM_PARAMS)}
              target="_blank"
              rel="noopener"
            >
              {experience.companyName}
            </a>
          ) : (
            experience.companyName
          )}
        </h3>

        {experience.isCurrentEmployer && (
          <Status status="maintenance" className="bg-transparent">
            <StatusIndicator />
            <StatusLabel className="sr-only">Current Employer</StatusLabel>
          </Status>
        )}
      </div>

      <div className="relative space-y-4">
        {experience.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </div>
  );
}
