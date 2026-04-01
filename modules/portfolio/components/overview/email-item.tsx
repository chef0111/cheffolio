'use client';

import { useHotkey } from '@tanstack/react-hotkeys';
import { MailIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useWebHaptics } from 'web-haptics/react';

import { CopyButton } from '@/components/cheffolio/copy-button';
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from '@/components/cheffolio/intro-item';
import { useIsClient } from '@/hooks/use-is-client';
import { copyText } from '@/utils/copy';
import { decodeEmail } from '@/utils/string';

type EmailItemProps = {
  email: string;
};

export function EmailItem({ email }: EmailItemProps) {
  const isClient = useIsClient();
  const emailDecoded = decodeEmail(email);

  useHotkey('Shift+E', async () => {
    const success = await copyText(emailDecoded);
    if (success) {
      toast.success('Email address copied to clipboard');
    } else {
      toast.error('Failed to copy email');
    }
  });

  const { trigger } = useWebHaptics({ debug: true });

  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <MailIcon />
      </IntroItemIcon>

      <IntroItemContent>
        <IntroItemLink
          href={isClient ? `mailto:${emailDecoded}` : '#'}
          aria-label={
            isClient ? `Send email to ${emailDecoded}` : 'Email address'
          }
        >
          {isClient ? emailDecoded : '[Email protected]'}
        </IntroItemLink>
      </IntroItemContent>

      <div className="-translate-x-3 translate-y-px opacity-0 transition-opacity ease-out group-hover:opacity-100">
        <CopyButton
          className="bg-transparent"
          variant="ghost"
          size="icon-xs"
          content={isClient ? emailDecoded : '[Email protected]'}
          onCopiedChange={() => {
            trigger('success');
          }}
        />
      </div>
    </IntroItem>
  );
}
