import { User } from '@/modules/portfolio/types/user';

export const USER: User = {
  firstName: 'Bảo',
  lastName: 'Lê',
  displayName: 'Gia Bảo',
  username: 'chef0111',
  gender: 'male',
  pronouns: 'he/him',
  bio: 'Creating with code. Small details matter.',
  flipSentences: [
    'Next.js Enthusiast',
    'Senior Student',
    'Fullstack Developer',
  ],
  address: 'Hue City, Viet Nam',
  phoneNumber: 'Kzg0IDg2NSA2NzUgOTA4', // E.164 format, base64 encoded (https://t.io.vn/base64-string-converter)
  email: 'bGV0cmFuZ2lhYmFvMTRAZ21haWwuY29t', // base64 encoded
  website: 'https://github.com/chef0111',
  jobTitle: 'Senior Student',
  jobs: [
    {
      title: 'Senior Student',
      company: 'UIT - VNUHCM',
      website: 'https://uit.edu.vn',
    },
  ],
  about: `
- **Senior Student** with a strong passion for software engineering — especially in web development.
- Hands-on experience working with modern web frameworks like **Next.js**, **TanStack Start**,...; enjoy building high-performance, scalable and user-centered web applications.
- Having a goal to consistently improve self technical skills and contribute to impactful software projects.
- Creator of [TKU Sparring System](https://tku-sparring.netlify.app/): User-friendly web application for managing Taekwondo sparring matches.
`,
  avatar:
    'https://res.cloudinary.com/dpuqj2n2q/image/upload/chef0111-avatar.webp',
  timeZone: 'Asia/Ho_Chi_Minh',
  dateCreated: '2026-03-22',
};
