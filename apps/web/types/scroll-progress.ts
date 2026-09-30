export type ScrollProgressSection = {
  id: string;
  label: React.ReactNode;
  depth?: number;
};

export type ScrollProgressProps = React.ComponentProps<'div'> & {
  sections: ScrollProgressSection[];
  containerRef?: React.RefObject<HTMLElement | null>;
  offset?: number;
};

export type SectionLabelMotion = {
  direction: number;
  edgeOffset: number;
  mode: 'slide' | 'fade' | 'instant';
  duration: number;
};
