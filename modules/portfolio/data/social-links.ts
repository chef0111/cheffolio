import type { SocialLink } from '../types/social-links';

const baseUrl = 'https://res.cloudinary.com/dpuqj2n2q/image/upload';

export const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: `${baseUrl}/x.webp`,
    title: 'X',
    subtitle: '@cheff0111',
    href: 'https://x.com/cheff0111',
  },
  {
    icon: `${baseUrl}/github.webp`,
    title: 'GitHub',
    subtitle: 'chef0111',
    href: 'https://github.com/chef0111',
  },
  {
    icon: `${baseUrl}/linkedin.webp`,
    title: 'LinkedIn',
    subtitle: 'chef0111',
    href: 'https://linkedin.com/in/chef0111',
  },
  {
    icon: `${baseUrl}/facebook.webp`,
    title: 'Facebook',
    subtitle: 'giabao.67.05',
    href: 'https://facebook.com/giabao.67.05',
  },
  {
    icon: `${baseUrl}/discord.webp`,
    title: 'Discord',
    subtitle: 'chef.0111',
    href: 'https://discord.com/users/chef.0111',
  },
  {
    icon: `${baseUrl}/instagram.webp`,
    title: 'Instagram',
    subtitle: '@chef.0111',
    href: 'https://www.instagram.com/chef.0111',
  },
];
