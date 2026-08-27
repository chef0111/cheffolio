'use client';

import { useCommandState } from 'cmdk';
import type { LucideProps } from 'lucide-react';
import {
  AwardIcon,
  BoxIcon,
  BriefcaseBusinessIcon,
  CornerDownLeftIcon,
  DownloadIcon,
  FileUser,
  LayersIcon,
  MailIcon,
  MonitorIcon,
  MoonStarIcon,
  PhoneIcon,
  Search,
  ServerIcon,
  SunMediumIcon,
  TextInitial,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Empty, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { UTM_PARAMS } from '@/config/site';
import { useCommandMenu } from '@/context/command-menu-provider';
import { SOCIAL_LINKS } from '@/features/portfolio/data/social-links';
import { USER } from '@/features/portfolio/data/user';
import { haptic } from '@/lib/haptic';
import { copyText } from '@/utils/copy';
import { decodeEmail, decodePhoneNumber } from '@/utils/string';
import { addQueryParams } from '@/utils/url';

import { Brand } from './brand';

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
    href: '#stack',
    icon: LayersIcon,
  },
  {
    title: 'Experience',
    href: '#experience',
    icon: BriefcaseBusinessIcon,
  },
  {
    title: 'Projects',
    href: '#projects',
    icon: BoxIcon,
  },
  {
    title: 'Honors & Awards',
    href: '#awards',
    icon: AwardIcon,
  },
];

const SOCIAL_LINK_ITEMS: CommandLinkItem[] = SOCIAL_LINKS.map((item) => ({
  title: item.title,
  href: addQueryParams(item.href, UTM_PARAMS),
  iconImage: item.icon,
  openInNewTab: true,
}));

export function CommandMenu() {
  const { setOpen } = useCommandMenu();

  const handleOpen = React.useCallback(() => {
    setOpen(true);
    haptic();
  }, [setOpen]);

  return <CommandMenuTrigger onClick={handleOpen} />;
}

export function CommandMenuDialog() {
  const { open, setOpen } = useCommandMenu();
  const router = useRouter();
  const { setTheme } = useTheme();

  useHotkeys(
    'mod+k',
    () => {
      setOpen((current) => !current);
    },
    { preventDefault: true, enableOnFormTags: true }
  );

  const handleOpenLink = React.useCallback(
    (href: string, openInNewTab = false) => {
      setOpen(false);
      haptic();

      if (openInNewTab) {
        window.open(href, '_blank', 'noopener');
      } else {
        router.push(href);
      }
    },
    [setOpen, router]
  );

  const handleCopy = React.useCallback(
    (text: string, message: string) => {
      setOpen(false);
      haptic();
      copyText(text);
      toast.success(message);
    },
    [setOpen]
  );

  const handleDownload = React.useCallback(
    (link: string) => {
      setOpen(false);
      haptic();
      window.open(link, '_self', 'noopener noreferrer');
    },
    [setOpen]
  );

  const handleSetTheme = React.useCallback(
    (theme: 'light' | 'dark' | 'system') => {
      setOpen(false);
      haptic();
      setTheme(theme);
    },
    [setOpen, setTheme]
  );

  return (
    <CommandDialog
      title="Command Menu"
      open={open}
      onOpenChange={setOpen}
      modal={false}
    >
      <CommandMenuInput />

      <div className="bg-background ring-border mx-1 rounded-xl ring-1">
        <CommandList className="bg-background dark:bg-background/50 scroll-fade min-h-80 rounded-xl">
          <CommandEmpty>
            <Empty className="gap-2">
              <EmptyMedia variant="icon">
                <ServerIcon />
              </EmptyMedia>
              <EmptyTitle>No results found</EmptyTitle>
            </Empty>
          </CommandEmpty>

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
            <CommandItem onSelect={() => handleOpenLink(USER.resume!, true)}>
              <FileUser className="text-muted-foreground" />
              Personal Resume
            </CommandItem>
            <CommandItem
              onSelect={() => handleDownload(USER.resumeDownloadUrl!)}
            >
              <DownloadIcon className="text-muted-foreground" />
              Download Resume
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
              Copy Email Address
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
              Copy Phone Number
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Theme">
            <CommandItem
              keywords={['theme']}
              onSelect={() => handleSetTheme('light')}
            >
              <SunMediumIcon className="text-muted-foreground" />
              Light
            </CommandItem>
            <CommandItem
              keywords={['theme']}
              onSelect={() => handleSetTheme('dark')}
            >
              <MoonStarIcon className="text-muted-foreground" />
              Dark
            </CommandItem>
            <CommandItem
              keywords={['theme']}
              onSelect={() => handleSetTheme('system')}
            >
              <MonitorIcon className="text-muted-foreground" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </div>

      <CommandMenuFooter />
    </CommandDialog>
  );
}

function CommandMenuTrigger({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="command-menu-trigger"
      aria-label="Open command menu"
      className="group text-muted-foreground hover:bg-background hover:text-muted-foreground dark:hover:bg-input/30 rounded-full shadow-none select-none active:scale-100"
      variant="outline"
      size="sm"
      {...props}
    >
      <Search data-icon="inline-start" className="size-5 sm:size-4 md:mr-1" />

      <span className="font-sans text-sm/4 font-medium sm:hidden">Search…</span>

      <KbdGroup className="hidden sm:in-[.os-macos_&]:flex">
        <Kbd className="group-active:text-foreground w-5 min-w-5">⌘</Kbd>
        <Kbd className="group-active:text-foreground w-5 min-w-5">K</Kbd>
      </KbdGroup>

      <KbdGroup className="hidden sm:not-[.os-macos_&]:flex">
        <Kbd className="group-active:text-foreground min-w-5">Ctrl</Kbd>
        <Kbd className="group-active:text-foreground w-5 min-w-5">K</Kbd>
      </KbdGroup>
    </Button>
  );
}

function CommandMenuInput() {
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <CommandInput
      placeholder="Type a command or search…"
      value={searchValue}
      onValueChange={setSearchValue}
    />
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

type CommandType = 'command' | 'page' | 'link';

const ENTER_ACTION_LABELS: Record<CommandType, string> = {
  command: 'Run Command',
  page: 'Go to Page',
  link: 'Open Link',
};

type CommandMetaMap = Map<
  string,
  {
    commandType: CommandType;
  }
>;

function buildCommandMetaMap() {
  const commandMetaMap: CommandMetaMap = new Map();

  commandMetaMap.set('Light', { commandType: 'command' });
  commandMetaMap.set('Dark', { commandType: 'command' });
  commandMetaMap.set('System', { commandType: 'command' });

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
