export type User = {
  firstName: string;
  lastName: string;
  /** Preferred public-facing name */
  displayName: string;
  /** Handle/username used in links or mentions */
  username: string;
  gender: 'male' | 'female' | 'non-binary';
  /** e.g. "he/him", "she/her", "they/them" */
  pronouns: string;
  bio: string;
  /** Short phrases rotated in UI (e.g., homepage flip effect) */
  flipSentences: string[];
  /** General location for display */
  address: string;
  /** E.164 format, base64 encoded (https://t.io.vn/base64-string-converter) */
  phoneNumber: string;
  /** base64 encoded (https://t.io.vn/base64-string-converter) */
  email: string;
  /** Personal/homepage URL */
  website: string;
  /** Primary/current role shown on profile */
  jobTitle: string;
  /** Rich about section; supports Markdown */
  about: string;
  /** Public URL to avatar image */
  avatar: string;
  /** Profile/site start date in YYYY-MM-DD */
  dateCreated: string;
};
