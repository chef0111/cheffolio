import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  className?: string;
  icon?: ComponentType<LucideProps>;
};
