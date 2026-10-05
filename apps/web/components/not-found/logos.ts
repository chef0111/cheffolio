export interface LogoDef {
  name: string;
  /** Brick width in px (canvas is 800 wide → `800 / brickWidth` columns). */
  brickWidth: number;
  pattern: string[];
  /** Bricks per pixel horizontally (default 1). */
  colScale?: number;
  /** Bricks per pixel vertically (default 1). */
  rowScale?: number;
  /** Left offset in bricks (default 0). */
  colOffset?: number;
  /** Top offset in bricks (default 0). */
  rowOffset?: number;
}

const giabao: LogoDef = {
  name: 'giabao.dev',
  brickWidth: 50,
  rowScale: 2,
  colOffset: 1,
  colScale: 1,
  rowOffset: 0,
  pattern: ['.XXX.XXX.', 'X....X..X', 'X.XX.XXX.', 'X..X.X..X', '.XX..XXX.'],
};

export const LOGOS: LogoDef[] = [giabao];

export function getLogoIndex(name?: string | null): number {
  if (!name) return 0;
  const index = LOGOS.findIndex(
    (logo) => logo.name.toLowerCase() === name.toLowerCase()
  );
  return index === -1 ? 0 : index;
}
