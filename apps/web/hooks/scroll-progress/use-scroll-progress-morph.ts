'use client';

import * as React from 'react';

import {
  type ScrollProgressSize,
  SURFACE_SHADOW_PADDING,
  SURFACE_TILE_OVERLAP,
  SURFACE_TILE_POSITIONS,
  surfaceTileTransform,
} from '@/lib/scroll-progress-morph';

const OPEN_EASING = 'cubic-bezier(0.77,0,0.175,1)';
const CLOSE_EASING = 'cubic-bezier(0.23,1,0.32,1)';

export function useScrollProgressMorph({
  triggerRef,
  open,
  instant,
  triggerSize,
  surfaceSize,
  measured,
}: {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  instant: boolean;
  triggerSize: ScrollProgressSize;
  surfaceSize: ScrollProgressSize;
  measured: boolean;
}) {
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const animationsRef = React.useRef<Animation[]>([]);
  const initializedRef = React.useRef(false);
  const generationRef = React.useRef(0);
  const [contentReady, setContentReady] = React.useState(false);
  const [surfaceReady, setSurfaceReady] = React.useState(false);
  const surfaceWidth = surfaceSize.width;
  const surfaceHeight = surfaceSize.height;

  React.useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const surface = surfaceRef.current;
    if (!trigger || !surface) {
      generationRef.current++;
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = [];
      initializedRef.current = false;
      setSurfaceReady(false);
      setContentReady(false);
      return;
    }
    if (!measured) return;
    const tiles = [...surface.children] as HTMLElement[];
    if (tiles.length !== SURFACE_TILE_POSITIONS.length) return;

    // Capture the compositor's current position before cancelling a reversed morph.
    const corner = new DOMMatrixReadOnly(getComputedStyle(tiles[0]).transform);
    const currentWidth = initializedRef.current
      ? -2 * (corner.m41 + SURFACE_SHADOW_PADDING)
      : surfaceWidth;
    const currentHeight = initializedRef.current
      ? -corner.m42 - SURFACE_SHADOW_PADDING
      : surfaceHeight;
    const generation = ++generationRef.current;
    animationsRef.current.forEach((animation) => animation.cancel());
    animationsRef.current = [];

    const animate =
      initializedRef.current &&
      !instant &&
      (Math.abs(currentWidth - surfaceWidth) > 0.01 ||
        Math.abs(currentHeight - surfaceHeight) > 0.01);
    const options: KeyframeAnimationOptions = {
      duration: 180,
      easing: open ? OPEN_EASING : CLOSE_EASING,
      fill: 'both',
    };
    const animations: Animation[] = [];
    const transition = (element: HTMLElement, start: string, end: string) => {
      element.style.transform = end;
      if (animate && start !== end) {
        animations.push(
          element.animate([{ transform: start }, { transform: end }], options)
        );
      }
    };

    const radius = triggerSize.height / 2;
    tiles.forEach((tile, index) => {
      const [column, row] = SURFACE_TILE_POSITIONS[index];
      // Rebase the CSS-only initial pill onto the center-bottom animation origin.
      Object.assign(tile.style, {
        left: '50%',
        top: '100%',
        translate: 'none',
        width: `${column === 1 ? radius * 2 : radius + SURFACE_SHADOW_PADDING + SURFACE_TILE_OVERLAP}px`,
        height: `${row === 1 ? radius * 2 : radius + SURFACE_SHADOW_PADDING + SURFACE_TILE_OVERLAP}px`,
      });
      transition(
        tile,
        // Matching transform functions interpolate zero-height strips without matrix decomposition.
        surfaceTileTransform(
          column,
          row,
          { width: currentWidth, height: currentHeight },
          radius
        ),
        surfaceTileTransform(
          column,
          row,
          { width: surfaceWidth, height: surfaceHeight },
          radius
        )
      );
    });

    const widthDelta = surfaceWidth - currentWidth;
    const labelInset = Math.max(0, widthDelta);
    const transforms = [
      ['scroll-progress-dot', widthDelta / 2],
      ['scroll-progress-label-viewport', widthDelta / 2],
      ['scroll-progress-ring', -widthDelta / 2],
      ['scroll-progress-label-mask', -labelInset],
      ['scroll-progress-label-content', labelInset],
    ] as const;
    transforms.forEach(([slot, x]) => {
      const element = trigger.querySelector<HTMLElement>(
        `[data-slot="${slot}"]`
      );
      if (element) transition(element, `translateX(${x}px)`, 'translateX(0px)');
    });

    initializedRef.current = true;
    setSurfaceReady(true);
    animationsRef.current = animations;
    setContentReady(open && animations.length === 0);

    Promise.all(animations.map((animation) => animation.finished)).then(
      () => {
        if (generationRef.current !== generation) return;
        animations.forEach((animation) => animation.cancel());
        animationsRef.current = [];
        setContentReady(open);
      },
      () => {}
    );
  }, [
    open,
    instant,
    triggerRef,
    triggerSize.height,
    surfaceWidth,
    surfaceHeight,
    measured,
  ]);

  React.useLayoutEffect(
    () => () => {
      generationRef.current++;
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = [];
      initializedRef.current = false;
    },
    []
  );

  return { surfaceRef, contentReady, surfaceReady };
}
