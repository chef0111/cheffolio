'use client';

import { useReducedMotion } from 'motion/react';
import { useTheme } from 'next-themes';
import type p5 from 'p5';
import { useCallback, useEffect, useRef, useState } from 'react';

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
} from './constants';
import { getLogoIndex } from './logos';
import { Paddle } from './paddle';
import { PaddleSlider } from './paddle-slider';
import { preloadSounds, unlockAudio } from './sounds';
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
  const controlsRef = useRef<{
    arm: () => void;
    startMotion: () => void;
    launchNow: () => void;
  } | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [ready, setReady] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);

  const handlePlay = useCallback(() => {
    void (async () => {
      const game = gameRef.current;
      if (!game || !ready) return;

      if (game.enableSounds) {
        await unlockAudio();
      }

      // Mobile: reveal slider and wait for drag before the ball moves.
      controlsRef.current?.arm();
    })();
  }, [ready]);

  const handleStartMotion = useCallback(() => {
    const game = gameRef.current;
    if (!game?.hasLaunched || game.bricks.length === 0) return;
    controlsRef.current?.startMotion();
  }, []);

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
        hasLaunched: false,
        setHasLaunched: (next) => {
          state.hasLaunched = next;
          if (!cancelled) setHasLaunched(next);
        },
        score: 0,
        bricks: [],
        logoIndex: getLogoIndex(defaultLogo),
        ballImage: null,
        paddleImage: null,
        paddleX: paddleXRef,
      };
      gameRef.current = state;

      let sketch: p5;
      let paddle: Paddle;
      let ball: Ball;
      let ui: UI;

      /** Unlock controls + place ball. Ball stays still until startMotion. */
      const armRound = () => {
        state.setHasLaunched(true);
        state.enableGame = false;
        ball.reset();
      };

      /** Begin ball movement. Does not reset position. */
      const startMotion = () => {
        if (!state.hasLaunched || state.bricks.length === 0) return;
        state.enableGame = true;
      };

      /** Desktop / keyboard: arm and go in one gesture. */
      const launchNow = () => {
        state.setHasLaunched(true);
        state.enableGame = true;
        ball.reset();
      };

      controlsRef.current = {
        arm: armRound,
        startMotion,
        launchNow,
      };

      instance = new P5((p: p5) => {
        sketch = p;

        p.preload = () => {
          void preloadSounds();

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

          // Desktop: canvas click starts immediately.
          state.canvas.mouseClicked(() => {
            if (window.matchMedia('(max-width: 767px)').matches) {
              // Mobile/tablet: tap resets; ball waits for slider.
              if (!state.hasLaunched) return false;
              armRound();
              return false;
            }
            void (async () => {
              if (state.enableSounds && !state.hasLaunched) {
                await unlockAudio();
              }
              launchNow();
            })();
            return false;
          });

          // Mobile/tablet: tap canvas to reset anytime after Play. Slider starts motion.
          state.canvas.touchStarted(() => {
            if (!state.hasLaunched || state.bricks.length === 0) return false;
            armRound();
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

        void (async () => {
          if (state.enableSounds && !state.hasLaunched) {
            await unlockAudio();
          }
          launchNow();
        })();
      };

      window.addEventListener('keypress', handleKeyPress);
    });

    return () => {
      cancelled = true;
      setReady(false);
      setHasLaunched(false);
      gameRef.current = null;
      controlsRef.current = null;
      paddleXRef.current = null;
      if (handleKeyPress) {
        window.removeEventListener('keypress', handleKeyPress);
      }
      instance?.remove();
    };
  }, [shouldReduceMotion, resolvedTheme, defaultLogo]);

  const showPlay = ready && !hasLaunched;

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
        {!ready && <GameLoadingStatus />}
      </div>
      <div
        className="h-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:hidden"
        aria-hidden="true"
      />
      <PaddleSlider
        showPlay={showPlay}
        disabled={!ready}
        onPlay={handlePlay}
        onStartMotion={handleStartMotion}
        onPaddleX={(x) => {
          paddleXRef.current = x;
        }}
      />
    </>
  );
}
