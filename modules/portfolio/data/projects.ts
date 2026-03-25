import type { Project } from '../types/projects';

const baseUrl = 'https://res.cloudinary.com/dpuqj2n2q/image/upload';

export const PROJECTS: Project[] = [
  {
    id: 'tku-sparring-app',
    title: 'TKU Sparring System',
    period: {
      start: '03.2025',
    },
    link: 'https://tku-sparring.netlify.app',
    skills: [
      'React',
      'TypeScript',
      'TanStack Start',
      'Better-Auth',
      'PostgreSQL',
      'Prisma',
      'Taekwondo',
      'Scoring System',
      'CRM',
    ],
    description: `A modern, user-friendly web application for managing Taekwondo sparring matches of UIT Taekwondo Tournament.
- Real-time match updates and score tracking
- Configurable scoring system supporting various match types and rulesets
- Successfully used in [Taekwondo UIT Tournament 2025](https://www.facebook.com/share/p/1P14qEWifg), receiving positive feedback from athletes
`,
    logo: `${baseUrl}/tku-sparring-app.ico`,
    isExpanded: true,
  },
  {
    id: 'cheffolio',
    title: 'Cheffolio',
    period: {
      start: '03.2026',
    },
    link: 'https://github.com/chef0111/cheffolio',
    skills: [
      'Next.js 16',
      'TypeScript',
      'TailwindCSS',
      'Motion',
      'shadcn/ui',
      'Vercel',
      'Portfolio',
    ],
    description: 'A minimal, pixel-perfect, shadcn/ui inspired dev portfolio.',
    logo: `${baseUrl}/cheffolio.svg`,
    isExpanded: true,
  },
];
