import { Panel, PanelContent } from '@/components/cheffolio/panel';
import { JobItem } from './job-item';
import {
  IntroItem,
  IntroItemIcon,
  IntroItemContent,
  IntroItemLink,
} from './intro-item';
import {
  LinkIcon,
  MapPinIcon,
  MarsIcon,
  NonBinaryIcon,
  VenusIcon,
} from 'lucide-react';
import { USER } from '@/modules/portfolio/data/user';
import { LocalTime } from './local-item';
import { PhoneItem } from './phone-item';
import { EmailItem } from './email-item';
import { urlToName } from '@/utils/url';
import { User } from '@/modules/portfolio/types/user';
import { DecorIcon } from '@/components/cheffolio/decor-icon';

export function Overview() {
  return (
    <Panel className="relative after:content-none">
      <DecorIcon className="size-4" position="top-left" />
      <DecorIcon className="size-4" position="top-right" />
      <DecorIcon className="size-4" position="bottom-left" />
      <DecorIcon className="size-4" position="bottom-right" />
      <h2 className="sr-only">Profile overview</h2>
      <PanelContent className="space-y-2.5">
        {USER.jobs.map((job, index) => {
          return (
            <JobItem
              key={index}
              title={job.title}
              company={job.company}
              website={job.website}
              experienceId={job.experienceId}
            />
          );
        })}

        <div className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
          <IntroItem>
            <IntroItemIcon>
              <MapPinIcon />
            </IntroItemIcon>
            <IntroItemContent>
              <IntroItemLink
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(USER.address)}`}
                aria-label={`Location: ${USER.address}`}
              >
                {USER.address}
              </IntroItemLink>
            </IntroItemContent>
          </IntroItem>

          <LocalTime timeZone={USER.timeZone} />
          <PhoneItem phoneNumber={USER.phoneNumber} />
          <EmailItem email={USER.email} />

          <IntroItem>
            <IntroItemIcon>
              <LinkIcon />
            </IntroItemIcon>
            <IntroItemContent>
              <IntroItemLink
                href={USER.website}
                aria-label={`Personal website: ${urlToName(USER.website)}`}
              >
                {urlToName(USER.website)}
              </IntroItemLink>
            </IntroItemContent>
          </IntroItem>

          <IntroItem>
            <IntroItemIcon>{getGenderIcon(USER.gender)}</IntroItemIcon>
            <IntroItemContent aria-label={`Pronouns: ${USER.pronouns}`}>
              {USER.pronouns}
            </IntroItemContent>
          </IntroItem>
        </div>
      </PanelContent>
    </Panel>
  );
}

function getGenderIcon(gender: User['gender']) {
  switch (gender) {
    case 'male':
      return <MarsIcon />;
    case 'female':
      return <VenusIcon />;
    case 'non-binary':
      return <NonBinaryIcon />;
  }
}
