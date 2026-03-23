'use client';

import { toast } from 'sonner';
import { PhoneIcon } from 'lucide-react';
import { useWebHaptics } from 'web-haptics/react';
import { useHotkey } from '@tanstack/react-hotkeys';

import { useIsClient } from '@/hooks/use-is-client';
import { copyText } from '@/utils/copy';
import { decodePhoneNumber, formatPhoneNumber } from '@/utils/string';

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from './intro-item';
import { CopyButton } from '@/components/cheffolio/copy-button';

type PhoneItemProps = {
  phoneNumber: string;
};

export function PhoneItem({ phoneNumber }: PhoneItemProps) {
  const isClient = useIsClient();
  const phoneNumberDecoded = decodePhoneNumber(phoneNumber);
  const phoneNumberFormatted = formatPhoneNumber(phoneNumberDecoded);

  useHotkey('Shift+P', async () => {
    const success = await copyText(phoneNumberDecoded);
    if (success) {
      toast.success('Phone number copied');
    }
  });

  const { trigger } = useWebHaptics({ debug: true });

  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <PhoneIcon />
      </IntroItemIcon>

      <IntroItemContent>
        <IntroItemLink
          href={isClient ? `tel:${phoneNumberDecoded}` : '#'}
          aria-label={
            isClient ? `Call ${phoneNumberFormatted}` : 'Phone number'
          }
        >
          {isClient ? phoneNumberFormatted : '[Phone protected]'}
        </IntroItemLink>
      </IntroItemContent>

      <div className="-translate-x-3 opacity-0 transition-opacity ease-out group-hover:opacity-100">
        <CopyButton
          className="bg-transparent"
          variant="ghost"
          size="icon-xs"
          content={isClient ? phoneNumberDecoded : '[Phone protected]'}
          onCopiedChange={() => {
            trigger('success');
          }}
        />
      </div>
    </IntroItem>
  );
}
