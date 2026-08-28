import type { SocialLink } from '../types/social-links';
import { USER } from './user';

const baseUrl = 'https://assets.giabao.dev/socials';

export const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: `${baseUrl}/x.webp`,
    title: 'X',
    subtitle: '@cheff0111',
    href: USER.socialLinks.x,
  },
  {
    icon: `${baseUrl}/github.webp`,
    title: 'GitHub',
    subtitle: 'chef0111',
    href: USER.socialLinks.github,
  },
  {
    icon: `${baseUrl}/linkedin.webp`,
    title: 'LinkedIn',
    subtitle: 'chef0111',
    href: USER.socialLinks.linkedin,
  },
  {
    icon: `${baseUrl}/discord.webp`,
    title: 'Discord',
    subtitle: 'chef.0111',
    href: USER.socialLinks.discord,
  },
  {
    icon: `${baseUrl}/facebook.webp`,
    title: 'Facebook',
    subtitle: 'giabao.67.05',
    href: USER.socialLinks.facebook,
  },
  {
    icon: `${baseUrl}/instagram.webp`,
    title: 'Instagram',
    subtitle: '@chef.0111',
    href: USER.socialLinks.instagram,
  },
];
