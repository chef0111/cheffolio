import {
  AwardIcon,
  BoxIcon,
  BriefcaseBusiness,
  TextInitial,
} from 'lucide-react';

import type { NavItem } from '@/modules/header/types/nav';
import { USER } from '@/modules/portfolio/data/user';

export const SITE_INFO = {
  name: 'Cheffolio',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cheffolio.vercel.app',
  ogImage: USER.ogImage,
  description: 'A minimalist, shadcn/ui-inspired dev portfolio of @chef0111.',
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
  utm_source: 'cheffolio.vercel.app',
};

export const GITHUB_USERNAME = 'chef0111';
export const X_USERNAME = '@cheff0111';

export const SOUNDS = {
  toggle: 'https://res.cloudinary.com/chef0111/video/upload/toggle.mp3',
};
