import type { Project } from '../types/projects';

const baseUrl = 'https://res.cloudinary.com/dpuqj2n2q/image/upload';

export const PROJECTS: Project[] = [
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
    id: 'fusionista',
    title: 'Fusionista 2.0',
    period: {
      start: '12.2025',
      end: '01.2026',
    },
    link: 'https://github.com/AIC-ICE-BEAR',
    skills: [
      'React',
      'TypeScript',
      'Vite',
      'FastAPI',
      'Event Retrieval',
      'Multimedia Modeling',
      'Embeddings',
      'GCP',
      'Teamwork',
    ],
    description: `A modern, user-friendly web application for multimedia event retrieval.
- Competed in [VBS2026](https://videobrowsershowdown.org/call-for-papers) and achieved 1st place — [Best Video Browsing System Award](https://www.facebook.com/share/p/179vdqNtxj), demonstrating strong performance in retrieving relevant multimedia content based on user queries
- Competed in [HCMC AI Challenge 2025](https://www.facebook.com/share/p/1LXSW3kDCv) and achieved 5th place, showcasing the system's effectiveness in handling complex multimedia retrieval tasks
`,
    isExpanded: true,
  },
  {
    id: 'physthink',
    title: 'PhysThink',
    period: {
      start: '02.2026',
      end: '03.2026',
    },
    link: 'https://github.com/chef0111/physthink',
    skills: [
      'Next.js 16',
      'TypeScript',
      'Better-Auth',
      'TailwindCSS',
      'shadcn/ui',
      'PostgreSQL',
      'Prisma',
      'Vercel',
      'AI-SDK',
      'Hackathon',
      'K2Think V2',
    ],
    description: `An intuitive Learning Management System built with Next.js 16, powered by **K2 Think V2**.
- AI-powered 3D illustration generation, allow users to create custom 3D models for Physics subjects
- Agentic experience using K2 Think V2, provide users with an interactive learning environment
- Competed in [Build with K2 Think V2](https://build.k2think.ai) hackathon, hosted by [MBZUAI](https://mbzuai.ac.ae)
`,
    logo: `${baseUrl}/physthink.svg`,
  },
  {
    id: 'dev4room',
    title: 'Dev4Room',
    period: {
      start: '09.2025',
      end: '01.2026',
    },
    link: 'https://github.com/chef0111/dev4room',
    skills: [
      'Next.js 16',
      'TypeScript',
      'Better-Auth',
      'TailwindCSS',
      'shadcn/ui',
      'PostgreSQL',
      'Drizzle',
      'Vercel',
      'Q&A Platform',
      'AI-powered Answers',
    ],
    description: `Community-driven platform for developers to ask questions, post answers, and get help from other developers. Live at [dev4room.pro](https://dev4room.pro)
- Authentication system with email/password and OAuth providers
- AI-powered answer generation using OpenAI's GPT-4.0, providing instant answers to user questions
- Real-time semantic search support, allow users to find relevant questions and answers quickly
- Responsive design ensuring a seamless experience across devices
`,
    logo: `${baseUrl}/dev4room.svg`,
  },
];
