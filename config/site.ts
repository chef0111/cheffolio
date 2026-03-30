import { NavItem } from '@/modules/header/nav';
import {
  AwardIcon,
  BoxIcon,
  BriefcaseBusiness,
  TextInitial,
} from 'lucide-react';

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

export const SOUNDS = {
  toggle: 'https://res.cloudinary.com/dpuqj2n2q/video/upload/toggle.mp3',
};
