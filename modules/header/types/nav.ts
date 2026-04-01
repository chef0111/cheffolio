import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

export type NavItem = {
  title: string;
  href: string;
  className?: string;
  icon?: ComponentType<LucideProps>;
};
