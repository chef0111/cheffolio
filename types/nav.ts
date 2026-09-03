export type NavItem<T extends string = string> = {
  title: string;
  href: T;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
