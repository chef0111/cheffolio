import { BoxIcon, FileUserIcon, HomeIcon, NewspaperIcon } from 'lucide-react';

import { SOCIAL } from '@/features/portfolio/data/social-links';
import { USER } from '@/features/portfolio/data/user';
import type { NavItem } from '@/types/nav';

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://giabao.dev',
  ogImage: USER.ogImage,
  description: `${USER.displayName} – ${USER.jobTitle} from Viet Nam. ${USER.bio}`,
  keywords: USER.keywords,
};

export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
};

export const MAIN_NAV: NavItem[] = [
  {
    title: 'Blog',
    href: '/blog',
  },
  {
    title: 'Projects',
    href: '/projects',
  },
  {
    title: 'Resume',
    href: '/resume',
  },
];

export const MOBILE_NAV: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: HomeIcon,
  },
  {
    title: 'Blog',
    href: '/blog',
    icon: NewspaperIcon,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: BoxIcon,
  },
  {
    title: 'Resume',
    href: '/resume',
    icon: FileUserIcon,
  },
];

export const UTM_PARAMS = {
  utm_source: 'giabao.dev',
};

export const X_PROFILE = SOCIAL.x.profile;
export const GITHUB_PROFILE = SOCIAL.github.profile;

export const GITHUB_REPO_URL = 'https://github.com/chef0111/cheffolio';

export const FOOTER_SLOGAN = 'Coding as Chef';
