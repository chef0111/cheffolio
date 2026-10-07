import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTitle,
} from '@/components/cheffolio/page-heading';
import { cn } from '@/lib/utils';

import { StripeSeparator } from '../cheffolio/stripe-separator';

type AppShellProps = {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
};

export function AppShell({
  title,
  description,
  className,
  children,
}: AppShellProps) {
  return (
    <div className={cn('mx-auto flex w-full flex-1 flex-col', className)}>
      <PageHeading className="pt-12">
        <PageHeadingTitle className="decor-t screen-line-bottom-none pt-2 pb-0">
          {title}
        </PageHeadingTitle>
        <PageHeadingDescription className="pt-0 pb-2">
          {description}
        </PageHeadingDescription>
      </PageHeading>

      <StripeSeparator />
      {children}
      <StripeSeparator />
    </div>
  );
}
