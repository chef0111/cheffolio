import { cn } from '@/lib/utils';

import { FullWidthDivider } from './full-width-divider';

type GridDividerProps = React.ComponentProps<'div'> & {
  rows: number;
};

/**
 *
 * @param total - The total number of items
 * @param mobileCols - The number of columns on mobile
 * @param desktopCols - The number of columns on desktop
 * @returns The number of rows for mobile and desktop
 */
export function getRowCounts(
  total: number,
  mobileCols: number,
  desktopCols: number
) {
  return {
    mobile: Math.ceil(total / mobileCols),
    desktop: Math.ceil(total / desktopCols),
  } as const;
}

export function GridDivider({
  rows,
  className,
  style,
  ...props
}: GridDividerProps) {
  if (rows <= 0) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-1 grid',
        className
      )}
      style={{
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        ...style,
      }}
      {...props}
    >
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="relative">
          {row > 0 && <FullWidthDivider contained className="top-0" />}
          {row < rows - 1 && (
            <FullWidthDivider contained className="bottom-0" />
          )}
        </div>
      ))}
    </div>
  );
}
