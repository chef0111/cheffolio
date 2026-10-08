export type ScrollProgressSize = { width: number; height: number };

export const SURFACE_SHADOW_PADDING = 8;
export const SURFACE_TILE_POSITIONS = [
  [0, 0],
  [1, 0],
  [2, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2],
] as const;

export function surfaceTileTransform(
  column: 0 | 1 | 2,
  row: 0 | 1 | 2,
  { width, height }: ScrollProgressSize,
  radius: number
) {
  const x = [
    -width / 2 - SURFACE_SHADOW_PADDING,
    -width / 2 + radius,
    width / 2 - radius,
  ][column];
  const y = [-height - SURFACE_SHADOW_PADDING, -height + radius, -radius][row];
  const scaleX =
    column === 1 ? Math.max(0, width - radius * 2) / (radius * 2) : 1;
  const scaleY =
    row === 1 ? Math.max(0, height - radius * 2) / (radius * 2) : 1;
  return `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`;
}
