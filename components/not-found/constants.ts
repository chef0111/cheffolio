export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const BALL_SIZE = 21;
export const BALL_SPEED = 10;
/** Smallest angle from +X. 45° so a serve is never flatter than a diagonal. */
export const BALL_LAUNCH_ANGLE = Math.PI / 4;

export const PADDLE_WIDTH = 96;
export const PADDLE_HEIGHT = 24;
export const PADDLE_SPEED = 16;

export const BRICK_HEIGHT = 24;
export const BRICK_SHADOW_THICKNESS = 3;
export const BRICK_SCORE = 10;

const ASSETS_ORIGIN = 'https://assets.giabao.dev';

export const BALL_LIGHT_URL = `${ASSETS_ORIGIN}/not-found/ball-light.png`;
export const BALL_DARK_URL = `${ASSETS_ORIGIN}/not-found/ball-dark.png`;

export const PADDLE_LIGHT_URL = `${ASSETS_ORIGIN}/not-found/paddle-light.png`;
export const PADDLE_DARK_URL = `${ASSETS_ORIGIN}/not-found/paddle-dark.png`;

export function uncheckedClamp(
  min: number,
  max: number,
  value: number
): number {
  return Math.min(Math.max(value, min), max);
}

export function paddleMinX(): number {
  return PADDLE_HEIGHT / 2;
}

export function paddleMaxX(canvasWidth: number): number {
  return canvasWidth - PADDLE_WIDTH - PADDLE_HEIGHT / 2;
}

export function clientXToCanvasX(
  canvas: HTMLCanvasElement,
  clientX: number,
  logicalWidth: number
): number {
  const { left, width } = canvas.getBoundingClientRect();
  if (width === 0) return 0;
  return ((clientX - left) / width) * logicalWidth;
}

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

let mobileMql: MediaQueryList | undefined;

export function isMobileViewport(): boolean {
  mobileMql ??= window.matchMedia(MOBILE_MEDIA_QUERY);
  return mobileMql.matches;
}
