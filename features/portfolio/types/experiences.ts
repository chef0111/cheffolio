export type ExperiencePositionIcon =
  | 'code'
  | 'design'
  | 'education'
  | 'business'
  | 'idea';

export type ExperiencePosition = {
  id: string;
  title: string;
  employmentPeriod: {
    start: string;
    end?: string;
  };
  /** Full-time | Part-time | Contract | Internship, etc. */
  employmentType?: string;
  description?: string;
  /** UI icon to represent the role type. */
  icon?: ExperiencePositionIcon;
  skills?: string[];
  isExpanded?: boolean;
  isCurrentPosition?: boolean;
};

export type Experience = {
  id: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  positions: ExperiencePosition[];
  isCurrentEmployer?: boolean;
};
