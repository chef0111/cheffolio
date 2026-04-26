'use client';

import { useHotkey } from '@tanstack/react-hotkeys';
import { PhoneIcon } from 'lucide-react';
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
import { decodePhoneNumber, formatPhoneNumber } from '@/utils/string';

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
      toast.success('Phone number copied to clipboard');
    } else {
      toast.error('Failed to copy phone number');
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
          className="text-muted-foreground bg-transparent"
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
