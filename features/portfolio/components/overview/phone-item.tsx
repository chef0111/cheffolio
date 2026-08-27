'use client';

import { PhoneIcon } from 'lucide-react';
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
import { decodePhoneNumber, formatPhoneNumber } from '@/utils/string';

import { RevealEncodedText } from './reveal-encoded-text';

type PhoneItemProps = {
  phoneNumber: string;
};

export function PhoneItem({ phoneNumber }: PhoneItemProps) {
  const id = useId();
  const isClient = useIsClient();
  const phoneNumberDecoded = decodePhoneNumber(phoneNumber);
  const phoneNumberFormatted = formatPhoneNumber(phoneNumberDecoded);

  useHotkeys('shift+p', () => {
    void copyText(phoneNumberDecoded).then((success) => {
      if (success) {
        toast.success('Phone number copied to clipboard');
      } else {
        toast.error('Failed to copy phone number');
      }
    });
  });

  const { trigger } = useWebHaptics({ debug: true });

  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <PhoneIcon />
      </IntroItemIcon>

      <IntroItemContent>
        <IntroItemLink
          id={`phone-${id}`}
          href={isClient ? `tel:${phoneNumberDecoded}` : '#'}
          aria-label={
            isClient ? `Call ${phoneNumberFormatted}` : 'Phone number'
          }
          suppressHydrationWarning
        >
          {isClient ? phoneNumberFormatted : '[Phone protected]'}
        </IntroItemLink>
      </IntroItemContent>

      <div className="ease-out-cubic -translate-x-3 opacity-0 transition-opacity group-hover:opacity-100">
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

      <RevealEncodedText id={`phone-${id}`} text={btoa(phoneNumberFormatted)} />
    </IntroItem>
  );
}
