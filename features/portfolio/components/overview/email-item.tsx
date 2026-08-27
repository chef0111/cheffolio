'use client';

import { MailIcon } from 'lucide-react';
import { useId } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
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

import { RevealEncodedText } from './reveal-encoded-text';

type EmailItemProps = {
  email: string;
};

export function EmailItem({ email }: EmailItemProps) {
  const id = useId();
  const isClient = useIsClient();
  const emailDecoded = decodeEmail(email);

  useHotkeys('shift+e', () => {
    void copyText(emailDecoded).then((success) => {
      if (success) {
        toast.success('Email address copied to clipboard');
      } else {
        toast.error('Failed to copy email');
      }
    });
  });

  const { trigger } = useWebHaptics({ debug: true });

  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <MailIcon />
      </IntroItemIcon>

      <IntroItemContent>
        <IntroItemLink
          id={`email-${id}`}
          href={isClient ? `mailto:${emailDecoded}` : '#'}
          aria-label={
            isClient ? `Send email to ${emailDecoded}` : 'Email address'
          }
          suppressHydrationWarning
        >
          {isClient ? emailDecoded : '[Email protected]'}
        </IntroItemLink>
      </IntroItemContent>

      <div className="ease-out-cubic -translate-x-3 translate-y-px opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton
          className="text-muted-foreground bg-transparent"
          variant="ghost"
          size="icon-xs"
          content={isClient ? emailDecoded : '[Email protected]'}
          onCopiedChange={() => {
            trigger('success');
          }}
        />
      </div>

      <RevealEncodedText id={`email-${id}`} text={email} />
    </IntroItem>
  );
}
