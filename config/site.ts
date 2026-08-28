import {
  AwardIcon,
  BoxIcon,
  BriefcaseBusiness,
  TextInitial,
} from 'lucide-react';

import type { NavItem } from '@/components/layout/navigation/types/nav';
import { USER } from '@/features/portfolio/data/user';

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://giabao.dev',
  ogImage: USER.ogImage,
  description:
    'Gia Bảo · Student Software Engineer from Vietnam. Love coding catchy things.',
  keywords: USER.keywords,
};

export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
};

export const MAIN_NAV: NavItem[] = [
  {
    title: 'About',
    href: '#about',
  },
  {
    title: 'Experience',
    href: '#experience',
  },
  {
    title: 'Projects',
    href: '#projects',
  },
  {
    title: 'Awards',
    href: '#awards',
  },
];

export const MOBILE_NAV: NavItem[] = [
  {
    title: 'About',
    href: '#about',
    icon: TextInitial,
  },
  {
    title: 'Experience',
    href: '#experience',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Projects',
    href: '#projects',
    icon: BoxIcon,
  },
  {
    title: 'Awards',
    href: '#awards',
    icon: AwardIcon,
  },
];

export const UTM_PARAMS = {
  utm_source: 'giabao.dev',
};

export const GITHUB_REPO_URL = 'https://github.com/chef0111/cheffolio';

export const GITHUB_USERNAME = 'chef0111';
export const X_USERNAME = '@cheff0111';

export const SOUNDS = {
  toggle: 'https://assets.giabao.dev/sounds/toggle.mp3',
};

export const FOOTER_SLOGAN = 'Coding as Chef';
