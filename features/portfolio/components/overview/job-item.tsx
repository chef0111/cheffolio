import {
  BriefcaseBusinessIcon,
  CodeXmlIcon,
  LightbulbIcon,
} from 'lucide-react';

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from '@/components/cheffolio/intro-item';
import { UTM_PARAMS } from '@/config/site';
import { addQueryParams } from '@/utils/url';

type JobItemProps = {
  title: string;
  company: string;
  website: string;
  experienceId?: string;
};

export function JobItem({
  title,
  company,
  website,
  experienceId,
}: JobItemProps) {
  return (
    <IntroItem>
      <IntroItemIcon>{getJobIcon(title)}</IntroItemIcon>

      <IntroItemContent>
        {title} @
        <IntroItemLink
          className="ml-0.5 font-medium"
          {...(experienceId
            ? {
                href: `#experience-${experienceId}`,
                target: '_self',
                rel: '',
              }
            : {
                href: addQueryParams(website, UTM_PARAMS),
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
        >
          {company}
        </IntroItemLink>
      </IntroItemContent>
    </IntroItem>
  );
}

function getJobIcon(title: string) {
  if (/(developer|engineer)/i.test(title)) {
    return <CodeXmlIcon />;
  }

  if (/(founder|co-founder)/i.test(title)) {
    return <LightbulbIcon />;
  }

  return <BriefcaseBusinessIcon />;
}
