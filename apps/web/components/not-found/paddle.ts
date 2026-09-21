import type p5 from 'p5';

import {
  clientXToCanvasX,
  isMobileViewport,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
  PADDLE_WIDTH,
  paddleMaxX,
  paddleMinX,
  uncheckedClamp,
} from './constants';
import type { GameState } from './types';

export class Paddle {
  p: p5;
  state: GameState;

  width: number;
  height: number;

  x: number;
  y: number;

  constructor(p: p5, state: GameState) {
    this.p = p;
    this.state = state;

    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;

    this.x = p.width / 2 - this.width / 2;
    this.y = p.height - this.height;

    state.canvas!.mouseMoved((e: MouseEvent) => {
      if (isMobileViewport()) {
        return false;
      }

      const canvas = state.canvas!.elt as HTMLCanvasElement;
      this.x = uncheckedClamp(
        paddleMinX(),
        paddleMaxX(p.width),
        clientXToCanvasX(canvas, e.clientX, p.width) - PADDLE_WIDTH / 2
      );
      this.state.paddleX.current = null;
      return false;
    });

    state.canvas!.touchMoved((e: TouchEvent) => {
      if (isMobileViewport()) {
        return false;
      }

      const canvas = state.canvas!.elt as HTMLCanvasElement;
      const touch = e.touches[0];

      this.x = uncheckedClamp(
        paddleMinX(),
        paddleMaxX(p.width),
        clientXToCanvasX(canvas, touch.clientX, p.width) - PADDLE_WIDTH / 2
      );
      this.state.paddleX.current = null;

      return false;
    });
  }

  show() {
    const image = this.state.paddleImage;
    if (!image?.width) return;

    this.p.imageMode(this.p.CORNER);
    this.p.image(image, this.x, this.y, PADDLE_WIDTH, PADDLE_HEIGHT);
  }

  move() {
    const sliderX = this.state.paddleX.current;
    if (sliderX != null) {
      this.x = sliderX;
    } else if (this.p.keyIsDown(this.p.LEFT_ARROW) && this.x > paddleMinX()) {
      this.x -= PADDLE_SPEED;
    } else if (
      this.p.keyIsDown(this.p.RIGHT_ARROW) &&
      this.x < paddleMaxX(this.p.width)
    ) {
      this.x += PADDLE_SPEED;
    }

    this.x = uncheckedClamp(paddleMinX(), paddleMaxX(this.p.width), this.x);
  }

  automove(ball: { x: number }) {
    this.x = uncheckedClamp(
      paddleMinX(),
      paddleMaxX(this.p.width),
      ball.x - this.width / 2
    );
  }
}
