import type p5 from 'p5';

import type { Brick } from './brick';
import type { GameSound } from './sounds';

export interface GameState {
  canvas: p5.Renderer | null;

  enableGame: boolean;
  enableSounds: boolean;

  score: number;
  bricks: Brick[];
  logoIndex: number;

  soundBounce: GameSound | null;
  soundBreak: GameSound | null;
  soundGameOver: GameSound | null;
  ballImage: p5.Image | null;
  paddleImage: p5.Image | null;
  paddleX: { current: number | null };
}
