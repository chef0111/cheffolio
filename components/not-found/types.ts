import type p5 from 'p5';

import type { Brick } from './brick';

export interface GameState {
  canvas: p5.Renderer | null;

  enableGame: boolean;
  enableSounds: boolean;
  /** True after the first Play / canvas start. Used to allow touch restarts. */
  hasLaunched: boolean;
  setHasLaunched: (hasLaunched: boolean) => void;

  score: number;
  bricks: Brick[];
  logoIndex: number;

  ballImage: p5.Image | null;
  paddleImage: p5.Image | null;
  paddleX: { current: number | null };
}
