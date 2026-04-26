export type User = {
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  gender: 'male' | 'female' | 'non-binary';
  /** e.g. "he/him", "she/her", "they/them" */
  pronouns: string;
  bio: string;
  /** Short phrases rotated in UI (e.g., homepage flip effect) */
  flipSentences: string[];
  address: string;
  /** E.164 format, base64 encoded (https://t.io.vn/base64-string-converter) */
  phoneNumber: string;
  /** base64 encoded (https://t.io.vn/base64-string-converter) */
  email: string;
  website: string;
  jobTitle: string;
  jobs: {
    title: string;
    company: string;
    website: string;
    experienceId?: string;
  }[];
  resume?: string;
  /** Rich about section; supports Markdown */
  about: string;
  avatar: string;
  /** Open Graph image URL for social sharing */
  ogImage: string;
  /** SEO keywords list for metadata */
  keywords: string[];
  /** Time zone in IANA format (e.g., "Asia/Ho_Chi_Minh") */
  timeZone: string;
  dateCreated: string;
};
