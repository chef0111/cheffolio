'use client';

import { useReducedMotion } from 'motion/react';
import { useTheme } from 'next-themes';
import type p5 from 'p5';
import { useEffect, useRef, useState } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { fontPixel } from '@/config/font';
import { cn } from '@/lib/utils';

import { Ball } from './ball';
import { resetGame } from './brick';
import { Colors, loadColors } from './colors';
import {
  BALL_DARK_URL,
  BALL_LIGHT_URL,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDLE_DARK_URL,
  PADDLE_LIGHT_URL,
  SOUND_BOUNCE_URL,
  SOUND_BREAK_URL,
  SOUND_GAME_OVER_URL,
} from './constants';
import { getLogoIndex } from './logos';
import { Paddle } from './paddle';
import { PaddleSlider } from './paddle-slider';
import { loadSound, unlockSounds } from './sounds';
import type { GameState } from './types';
import { UI } from './ui';

const PIXEL_FONT_FAMILY = fontPixel.style.fontFamily
  .split(',')[0]
  .trim()
  .replaceAll(/^['"]+|['"]+$/g, '');

type SpriteImage = p5.Image & {
  canvas: HTMLCanvasElement;
  drawingContext: CanvasRenderingContext2D;
  modified: boolean;
};

function fitCanvas(canvas: p5.Renderer) {
  const elt = canvas.elt as HTMLCanvasElement;
  elt.style.width = '100%';
  elt.style.height = '100%';
  elt.style.display = 'block';
  elt.style.touchAction = 'none';
  elt.style.imageRendering = 'pixelated';
}

function GameLoadingStatus() {
  return (
    <div
      role="status"
      className="bg-background absolute inset-0 z-10 grid place-items-center"
    >
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6" />
        <span className="text-muted-foreground font-pixel text-sm">
          Loading FIG_404
        </span>
      </div>
    </div>
  );
}

function loadSprite(p: p5, url: string) {
  return new Promise<p5.Image | null>((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const image = p.createImage(
          img.naturalWidth,
          img.naturalHeight
        ) as SpriteImage;
        image.drawingContext.drawImage(img, 0, 0);
        image.modified = true;
        resolve(image);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function startGame(state: GameState) {
  state.enableGame = true;
  if (!state.enableSounds) return;
  unlockSounds();
}

export function NotFound({
  className,
  defaultLogo,
  ...props
}: Omit<React.ComponentPropsWithRef<'div'>, 'children'> & {
  defaultLogo?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const paddleXRef = useRef<number | null>(null);
  const gameRef = useRef<GameState | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!resolvedTheme) return;

    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let instance: p5 | undefined;
    let handleKeyPress: ((e: KeyboardEvent) => void) | undefined;

    void import('p5').then(({ default: P5 }) => {
      if (cancelled) return;

      loadColors();

      const state: GameState = {
        canvas: null,
        enableGame: false,
        enableSounds: !shouldReduceMotion,
        score: 0,
        bricks: [],
        logoIndex: getLogoIndex(defaultLogo),
        soundBounce: null,
        soundBreak: null,
        soundGameOver: null,
        ballImage: null,
        paddleImage: null,
        paddleX: paddleXRef,
      };
      gameRef.current = state;

      let sketch: p5;
      let paddle: Paddle;
      let ball: Ball;
      let ui: UI;

      instance = new P5((p: p5) => {
        sketch = p;

        p.preload = () => {
          state.soundBounce = loadSound(SOUND_BOUNCE_URL);
          state.soundBreak = loadSound(SOUND_BREAK_URL);
          state.soundGameOver = loadSound(SOUND_GAME_OVER_URL);

          void Promise.all([
            loadSprite(
              p,
              resolvedTheme === 'dark' ? BALL_DARK_URL : BALL_LIGHT_URL
            ),
            loadSprite(
              p,
              resolvedTheme === 'dark' ? PADDLE_DARK_URL : PADDLE_LIGHT_URL
            ),
          ]).then(([ballImage, paddleImage]) => {
            if (cancelled) return;
            state.ballImage = ballImage;
            state.paddleImage = paddleImage;
            requestAnimationFrame(() => {
              if (!cancelled) setReady(true);
            });
          });
        };

        p.setup = () => {
          state.canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
          fitCanvas(state.canvas);
          paddle = new Paddle(p, state);
          ball = new Ball(p, state);
          ui = new UI(p, state);

          p.imageMode(p.CENTER);
          p.textFont(PIXEL_FONT_FAMILY);
          p.background(Colors.background);
          p.fill(Colors.foreground);
          p.noStroke();

          resetGame(p, state);

          state.canvas.mouseClicked(() => {
            startGame(state);
            ball.reset();
            return false;
          });

          state.canvas.touchStarted(() => {
            startGame(state);
            return false;
          });
        };

        p.draw = () => {
          if (!state.ballImage?.width || !state.paddleImage?.width) return;

          p.background(Colors.background);

          if (state.bricks.length === 0) {
            p.fill(Colors.foreground);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(80);
            p.text('404', p.width / 2, p.height / 2 - 11);
            return;
          }

          paddle.show();
          paddle.move();

          ball.show();
          if (state.enableGame) {
            ball.move();
            ball.checkEdges();
            ball.checkPaddle(paddle);
          }

          for (const brick of state.bricks) {
            brick.show();
          }
          p.noStroke();

          ball.checkBricks(state.bricks);
          ui.show();
        };
      }, host);

      if (cancelled) {
        instance.remove();
        instance = undefined;
        return;
      }

      handleKeyPress = (e: KeyboardEvent) => {
        if (e.key !== ' ') return;

        if (state.bricks.length === 0) {
          state.enableGame = false;
          ball.reset();
          resetGame(sketch, state);
          return;
        }

        startGame(state);
        ball.reset();
      };

      window.addEventListener('keypress', handleKeyPress);
    });

    return () => {
      cancelled = true;
      setReady(false);
      gameRef.current = null;
      paddleXRef.current = null;
      if (handleKeyPress) {
        window.removeEventListener('keypress', handleKeyPress);
      }
      instance?.remove();
    };
  }, [shouldReduceMotion, resolvedTheme, defaultLogo]);

  return (
    <>
      <div
        className={cn(
          'ring-border relative mx-auto w-full max-w-200 min-w-0 ring-2',
          className
        )}
        aria-busy={!ready}
        {...props}
      >
        <div
          ref={hostRef}
          className="aspect-4/3 w-full touch-none overflow-hidden select-none"
        />
        {ready ? null : <GameLoadingStatus />}
      </div>
      <div
        className="h-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:hidden"
        aria-hidden
      />
      <PaddleSlider
        disabled={!ready}
        onPaddleX={(x) => {
          paddleXRef.current = x;
        }}
        onEngage={() => {
          const game = gameRef.current;
          if (!game) return;
          startGame(game);
        }}
      />
    </>
  );
}
