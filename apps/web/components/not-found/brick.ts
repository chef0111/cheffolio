import type p5 from 'p5';

import { Colors } from './colors';
import { BRICK_HEIGHT, BRICK_SHADOW_THICKNESS } from './constants';
import { type LogoDef, LOGOS } from './logos';
import type { GameState } from './types';

export function layoutLogoBricks(
  canvasWidth: number,
  logo: LogoDef
): { x: number; y: number; w: number; h: number }[] {
  const { brickWidth, pattern } = logo;
  const colScale = logo.colScale ?? 1;
  const rowScale = logo.rowScale ?? 1;
  const rowOffset = logo.rowOffset ?? 0;

  const patternCols = Math.max(0, ...pattern.map((row) => row.length));
  const offsetX = (canvasWidth - patternCols * colScale * brickWidth) / 2;

  const bricks: { x: number; y: number; w: number; h: number }[] = [];

  for (let py = 0; py < pattern.length; ++py) {
    const row = pattern[py];
    for (let px = 0; px < row.length; ++px) {
      if (row[px] !== 'X') continue;

      for (let dx = 0; dx < colScale; ++dx) {
        for (let dy = 0; dy < rowScale; ++dy) {
          bricks.push({
            x: offsetX + (px * colScale + dx) * brickWidth,
            y: (rowOffset + py * rowScale + dy) * BRICK_HEIGHT,
            w: brickWidth,
            h: BRICK_HEIGHT,
          });
        }
      }
    }
  }

  return bricks;
}

export class Brick {
  p: p5;
  c: p5.Color | string = Colors.brick;
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(p: p5, x: number, y: number, w: number, h: number) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  color(c: p5.Color | string): this {
    this.c = c;
    return this;
  }

  show() {
    this.p.strokeWeight(4);
    this.p.stroke(Colors.background);
    this.p.fill(this.c.toString());
    this.p.rect(this.x, this.y, this.w, this.h);
    this.p.noStroke();

    this.p.fill(Colors.brickHighlight);
    this.p.rect(this.x + 2, this.y + 2, this.w - 4, BRICK_SHADOW_THICKNESS);
    this.p.rect(
      this.x + 2,
      this.y + 2 + BRICK_SHADOW_THICKNESS,
      BRICK_SHADOW_THICKNESS,
      this.h - 4 - BRICK_SHADOW_THICKNESS
    );

    this.p.fill(Colors.brickShadow);
    this.p.rect(
      this.x + 2,
      this.y + this.h - 5,
      this.w - 4,
      BRICK_SHADOW_THICKNESS
    );
    this.p.rect(
      this.x + this.w - 5,
      this.y + 2,
      BRICK_SHADOW_THICKNESS,
      this.h - 4 - BRICK_SHADOW_THICKNESS
    );
  }
}

export function resetGame(p: p5, state: GameState) {
  state.score = 0;

  // Advance the index so each reset cycles to a different logo.
  const logo = LOGOS[state.logoIndex % LOGOS.length];
  state.logoIndex = (state.logoIndex + 1) % LOGOS.length;

  state.bricks = layoutLogoBricks(p.width, logo).map((rect) =>
    new Brick(p, rect.x, rect.y, rect.w, rect.h).color(Colors.brick)
  );
}
