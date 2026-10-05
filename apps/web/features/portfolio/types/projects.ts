export type Project = {
  id: string;
  title: string;
  /**
   * Project period for display and sorting.
   * Use "MM.YYYY" format. Omit `end` for ongoing projects.
   */
  period: {
    start: string;
    end?: string;
  };
  link: string;
  skills: string[];
  description?: string;
  logo?: string;
  isExpanded?: boolean;
};
