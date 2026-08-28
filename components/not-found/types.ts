import type p5 from 'p5';

import type { Brick } from './brick';

export interface GameState {
  canvas: p5.Renderer | null;

  enableGame: boolean;
  enableSounds: boolean;

  score: number;
  bricks: Brick[];
  logoIndex: number;

  soundBounce: HTMLAudioElement | null;
  soundBreak: HTMLAudioElement | null;
  soundGameOver: HTMLAudioElement | null;
  ballImage: p5.Image | null;
  paddleImage: p5.Image | null;
}
