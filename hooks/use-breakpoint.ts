import { useMediaQuery } from '@/hooks/use-media-query';

const BREAKPOINTS = {
  xs: '(max-width: 480px)',
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 896px)',
  xl: '(max-width: 1024px)',
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useBreakpoints<T extends Breakpoint>(breakpoints: T[]) {
  const xs = useMediaQuery(BREAKPOINTS['xs']);
  const sm = useMediaQuery(BREAKPOINTS['sm']);
  const md = useMediaQuery(BREAKPOINTS['md']);
  const lg = useMediaQuery(BREAKPOINTS['lg']);
  const xl = useMediaQuery(BREAKPOINTS['xl']);

  const all = { xs, sm, md, lg, xl } as Record<Breakpoint, boolean>;

  return Object.fromEntries(breakpoints.map((bp) => [bp, all[bp]])) as Record<
    T,
    boolean
  >;
}
