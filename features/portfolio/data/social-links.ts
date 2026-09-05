import type { SocialProfile } from '../types/social-links';
import { USER } from './user';

const baseUrl = 'https://assets.giabao.dev/socials';

export const SOCIAL = {
  x: {
    icon: `${baseUrl}/x.webp`,
    title: 'X',
    profile: '@cheff0111',
    href: USER.socialLinks.x,
    sameAs: true,
  },
  github: {
    icon: `${baseUrl}/github.webp`,
    title: 'GitHub',
    profile: 'chef0111',
    href: USER.socialLinks.github,
    sameAs: true,
  },
  linkedin: {
    icon: `${baseUrl}/linkedin.webp`,
    title: 'LinkedIn',
    profile: 'chef0111',
    href: USER.socialLinks.linkedin,
    sameAs: true,
  },
  discord: {
    icon: `${baseUrl}/discord.webp`,
    title: 'Discord',
    profile: 'chef.0111',
    href: USER.socialLinks.discord,
    sameAs: true,
  },
  facebook: {
    icon: `${baseUrl}/facebook.webp`,
    title: 'Facebook',
    profile: 'giabao.67.05',
    href: USER.socialLinks.facebook,
    sameAs: true,
  },
  instagram: {
    icon: `${baseUrl}/instagram.webp`,
    title: 'Instagram',
    profile: '@chef.0111',
    href: USER.socialLinks.instagram,
    sameAs: true,
  },
} satisfies Record<string, SocialProfile>;

type SocialName = keyof typeof SOCIAL;

type SocialLink = SocialProfile & { name: SocialName };

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }));
