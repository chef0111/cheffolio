import type { Experience } from '../types/experiences';

export const EXPERIENCES: Experience[] = [
  {
    id: 'education',
    companyName: 'Education',
    positions: [
      {
        id: '3',
        title: 'University of Information Technology — VNUHCM',
        employmentPeriod: {
          start: '08.2023',
        },
        icon: 'education',
        description: `- Currently studying for a Bachelor's degree in Information Systems (Advanced Program).
- Language Proficiency: IELTS 7.0 (British Council).
- Achieved several awards, including:
  - Best Video Browsing System Award — 32nd International Conference on Multimedia Modeling (MMM 2026)
  - 5th Place — Ho Chi Minh City AI Challenge (AIC 2025)`,
        skills: [
          'C++',
          'Java',
          'Python',
          'JavaScript',
          'TypeScript',
          'Databases',
          'Web Frameworks',
          'Systems Design',
          'Software Engineering',
        ],
        isCurrentPosition: true,
        isExpanded: true,
      },
      {
        id: '2',
        title: 'Hai Ba Trung High School — Hue City',
        employmentPeriod: {
          start: '09.2020',
          end: '06.2023',
        },
        icon: 'education',
        skills: ['Algorithms', 'C++', 'HTML', 'CSS', 'JavaScript'],
      },
      {
        id: '1',
        title: 'Nguyen Tri Phuong Secondary School — Hue City',
        employmentPeriod: {
          start: '08.2016',
          end: '06.2020',
        },
        icon: 'education',
        skills: ['Pascal', 'Basic Programming', 'Mathematics'],
      },
    ],
  },
];
