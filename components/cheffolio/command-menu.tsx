'use client';

import React, { useCallback, useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useHotkey } from '@tanstack/react-hotkeys';
import { useCommandState } from 'cmdk';
import { decodeEmail, decodePhoneNumber } from '@/utils/string';
import { addQueryParams } from '@/utils/url';
import { UTM_PARAMS } from '@/config/site';
import Image from 'next/image';

import { Brand } from './brand';
import { Button } from '@/components/ui/button';
import { KbdGroup, Kbd } from '@/components/ui/kbd';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { SOCIAL_LINKS } from '@/modules/portfolio/data/social-links';
import {
  AwardIcon,
  BoxIcon,
  BriefcaseBusinessIcon,
  ContrastIcon,
  CornerDownLeftIcon,
  DownloadIcon,
  LayersIcon,
  LucideProps,
  MailIcon,
  MoonIcon,
  PhoneIcon,
  Search,
  SunIcon,
  TextInitial,
} from 'lucide-react';
import { copyText } from '@/utils/copy';
import { toast } from 'sonner';
import { USER } from '@/modules/portfolio/data/user';

type CommandLinkItem = {
  title: string;
  href: string;

  icon?: React.ComponentType<LucideProps>;
  iconImage?: string;
  keywords?: string[];
  openInNewTab?: boolean;
};

const PORTFOLIO_LINKS: CommandLinkItem[] = [
  {
    title: 'About',
    href: '#about',
    icon: TextInitial,
  },
  {
    title: 'Tech Stack',
    href: '/#stack',
    icon: LayersIcon,
  },
  {
    title: 'Experience',
    href: '/#experience',
    icon: BriefcaseBusinessIcon,
  },
  {
    title: 'Projects',
    href: '/#projects',
    icon: BoxIcon,
  },
  {
    title: 'Honors & Awards',
    href: '/#awards',
    icon: AwardIcon,
  },
];

const SOCIAL_LINK_ITEMS: CommandLinkItem[] = SOCIAL_LINKS.map((item) => ({
  title: item.title,
  href: addQueryParams(item.href, UTM_PARAMS),
  iconImage: item.icon,
  openInNewTab: true,
}));

export function CommandMenu({
  enabledHotkeys = false,
}: {
  enabledHotkeys?: boolean;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useHotkey(
    'Mod+K',
    (e) => {
      e.preventDefault();
      setOpen((open) => !open);
    },
    { enabled: enabledHotkeys }
  );

  const handleOpenLink = useCallback(
    (href: string, openInNewTab = false) => {
      setOpen(false);

      if (openInNewTab) {
        window.open(href, '_blank', 'noopener');
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const handleCopy = useCallback((text: string, message: string) => {
    setOpen(false);
    copyText(text);
    toast.success(message);
  }, []);

  const handleSetTheme = useCallback(
    (theme: 'light' | 'dark' | 'system') => {
      setOpen(false);
      setTheme(theme);
    },
    [setTheme]
  );

  return (
    <>
      <CommandMenuTrigger onClick={() => setOpen(true)} />

      <CommandDialog open={open} onOpenChange={setOpen} modal={false}>
        <CommandInput
          placeholder="Type a command or search…"
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList className="bg-background dark:bg-background/50 mx-1 min-h-80 rounded-xl py-1 shadow-sm">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandLinkGroup
            heading="Portfolio"
            links={PORTFOLIO_LINKS}
            onLinkSelect={handleOpenLink}
          />
          <CommandLinkGroup
            heading="Social Links"
            links={SOCIAL_LINK_ITEMS}
            onLinkSelect={handleOpenLink}
          />

          <CommandGroup heading="Personal Info">
            <CommandItem onSelect={() => null}>
              <DownloadIcon className="text-muted-foreground" />
              Download CV
            </CommandItem>
            <CommandItem
              onSelect={() => {
                handleCopy(
                  decodeEmail(USER.email),
                  'Email address copied to clipboard'
                );
              }}
            >
              <MailIcon className="text-muted-foreground" />
              Copy email address
            </CommandItem>
            <CommandItem
              onSelect={() => {
                handleCopy(
                  decodePhoneNumber(USER.phoneNumber),
                  'Phone number copied to clipboard'
                );
              }}
            >
              <PhoneIcon className="text-muted-foreground" />
              Copy phone number
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Theme">
            <CommandItem
              keywords={['theme']}
              onSelect={() => handleSetTheme('light')}
            >
              <SunIcon className="text-muted-foreground" />
              Light
            </CommandItem>
            <CommandItem
              keywords={['theme']}
              onSelect={() => handleSetTheme('dark')}
            >
              <MoonIcon className="text-muted-foreground" />
              Dark
            </CommandItem>
            <CommandItem
              keywords={['theme']}
              onSelect={() => handleSetTheme('system')}
            >
              <ContrastIcon className="text-muted-foreground" />
              Auto
            </CommandItem>
          </CommandGroup>
        </CommandList>

        <CommandMenuFooter />
      </CommandDialog>
    </>
  );
}

function CommandMenuTrigger({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="command-menu-trigger"
      className="text-muted-foreground hover:bg-background hover:text-muted-foreground dark:hover:bg-input/30 gap-1.5 rounded-full shadow-none select-none"
      variant="outline"
      size="sm"
      {...props}
    >
      <Search className="md:mr-1" />

      <span className="font-sans text-sm/4 font-medium sm:hidden">Search…</span>

      <KbdGroup className="hidden sm:in-[.os-macos_&]:flex">
        <Kbd className="w-5 min-w-5">⌘</Kbd>
        <Kbd className="w-5 min-w-5">K</Kbd>
      </KbdGroup>

      <KbdGroup className="hidden sm:not-[.os-macos_&]:flex">
        <Kbd>Ctrl</Kbd>
        <Kbd className="w-5 min-w-5">K</Kbd>
      </KbdGroup>
    </Button>
  );
}

function CommandLinkGroup({
  heading,
  links,
  fallbackIcon,
  onLinkSelect,
}: {
  heading: string;
  links: CommandLinkItem[];
  fallbackIcon?: React.ComponentType<LucideProps>;
  onLinkSelect: (href: string, openInNewTab?: boolean) => void;
}) {
  return (
    <CommandGroup heading={heading}>
      {links.map((link) => {
        const Icon = link?.icon ?? fallbackIcon ?? React.Fragment;

        return (
          <CommandItem
            key={link.href}
            keywords={link.keywords}
            onSelect={() => onLinkSelect(link.href, link.openInNewTab)}
          >
            {link?.iconImage ? (
              <Image
                className="corner-squircle rounded-sm supports-corner-shape:rounded-[50%]"
                src={link.iconImage}
                alt={link.title}
                width={16}
                height={16}
                unoptimized
              />
            ) : (
              <Icon className="text-muted-foreground" />
            )}
            <p className="line-clamp-1">{link.title}</p>
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
}

type CommandKind = 'command' | 'page' | 'link';

const ENTER_ACTION_LABELS: Record<CommandKind, string> = {
  command: 'Run Command',
  page: 'Go to Page',
  link: 'Open Link',
};

type CommandMetaMap = Map<
  string,
  {
    commandType: CommandKind;
  }
>;

function buildCommandMetaMap() {
  const commandMetaMap: CommandMetaMap = new Map();

  commandMetaMap.set('Light', { commandType: 'command' });
  commandMetaMap.set('Dark', { commandType: 'command' });
  commandMetaMap.set('Auto', { commandType: 'command' });

  commandMetaMap.set('Download CV', {
    commandType: 'command',
  });
  commandMetaMap.set('Copy Email Address', {
    commandType: 'command',
  });
  commandMetaMap.set('Copy Phone Number', {
    commandType: 'command',
  });

  SOCIAL_LINK_ITEMS.forEach((item) => {
    commandMetaMap.set(item.title, {
      commandType: 'link',
    });
  });

  return commandMetaMap;
}

const COMMAND_META_MAP = buildCommandMetaMap();

function CommandMenuFooter() {
  const selectedCommandType = useCommandState(
    (state) => COMMAND_META_MAP.get(state.value)?.commandType ?? 'page'
  );

  return (
    <>
      <div className="flex h-10" />

      <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between gap-2 rounded-b-2xl px-4 text-xs font-medium">
        <Brand className="text-muted-foreground size-6" />

        <div className="flex shrink-0 items-center gap-2 max-sm:hidden">
          <span>{ENTER_ACTION_LABELS[selectedCommandType]}</span>
          <Kbd>
            <CornerDownLeftIcon />
          </Kbd>
          <Separator
            orientation="vertical"
            className="data-vertical:h-4 data-vertical:self-center"
          />
          <span className="text-muted-foreground">Exit</span>
          <Kbd>Esc</Kbd>
        </div>
      </div>
    </>
  );
}
