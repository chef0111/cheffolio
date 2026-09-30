'use client';

import { cancelFrame, frame } from 'motion/react';
import * as React from 'react';

function projectionMatrix(element: HTMLElement) {
  return new DOMMatrixReadOnly(
    element.style.transform === 'none'
      ? undefined
      : element.style.transform || undefined
  );
}

export function useTriggerLabelReveal({
  triggerRef,
  open,
  popupWidth,
}: {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  popupWidth: number;
}) {
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const ringRef = React.useRef<HTMLSpanElement>(null);
  const maskRef = React.useRef<HTMLSpanElement>(null);
  const contentRef = React.useRef<HTMLSpanElement>(null);
  const geometryRef = React.useRef<{
    labelLeft: number;
    labelWidth: number;
    ringLeft: number;
    ringWidth: number;
    gap: number;
  } | null>(null);
  const visibleWidthRef = React.useRef<number | null>(null);
  const insetRef = React.useRef<number | null>(null);
  const applyInset = React.useCallback(
    (inset: number) => {
      const mask = maskRef.current;
      const content = contentRef.current;
      if (!mask || !content) return;
      const next = Math.max(0, Math.round(inset * 1000) / 1000);
      if (next === insetRef.current) return;
      insetRef.current = next;
      // Translate the clipping box and counter-translate its text to keep it still.
      mask.style.transform = `translateX(${-next}px)`;
      content.style.transform = `translateX(${next}px)`;
    },
    [maskRef, contentRef]
  );
  const measure = React.useCallback(() => {
    const trigger = triggerRef.current;
    const label = labelRef.current;
    const ring = ringRef.current;
    if (!trigger || !label || !ring) return;
    geometryRef.current = {
      labelLeft: label.offsetLeft,
      labelWidth: label.offsetWidth,
      ringLeft: ring.offsetLeft,
      ringWidth: ring.offsetWidth,
      gap: Number.parseFloat(getComputedStyle(trigger).columnGap) || 0,
    };
  }, [triggerRef, labelRef, ringRef]);
  const update = React.useCallback(() => {
    const trigger = triggerRef.current;
    const label = labelRef.current;
    const ring = ringRef.current;
    const geometry = geometryRef.current;
    if (!trigger || !label || !ring || !geometry) return;

    // Projection transforms around each element's center. Inline matrices avoid
    // forcing layout after Motion's writes on every animation frame.
    const triggerScale = projectionMatrix(trigger).a || 1;
    const labelMatrix = projectionMatrix(label);
    const ringMatrix = projectionMatrix(ring);
    const labelLeft =
      geometry.labelLeft +
      labelMatrix.m41 +
      (geometry.labelWidth * (1 - labelMatrix.a)) / 2;
    const ringLeft =
      geometry.ringLeft +
      ringMatrix.m41 +
      (geometry.ringWidth * (1 - ringMatrix.a)) / 2;
    const visibleWidth = Math.max(
      0,
      (ringLeft - labelLeft - geometry.gap / triggerScale) /
        (labelMatrix.a || 1)
    );
    visibleWidthRef.current = visibleWidth;
    applyInset(geometry.labelWidth - visibleWidth);
  }, [triggerRef, labelRef, ringRef, applyInset]);

  const start = React.useCallback(() => {
    measure();
    frame.postRender(update, true);
  }, [measure, update]);
  const stop = React.useCallback(() => {
    cancelFrame(update);
    frame.postRender(update);
  }, [update]);

  React.useLayoutEffect(() => {
    measure();
    const geometry = geometryRef.current;
    if (geometry && visibleWidthRef.current !== null) {
      // Keep the previous visible width until projection starts this frame.
      applyInset(geometry.labelWidth - visibleWidthRef.current);
    }
    frame.postRender(update);
    return () => cancelFrame(update);
  }, [open, popupWidth, measure, applyInset, update]);

  React.useLayoutEffect(() => {
    const label = labelRef.current;
    if (!label) return;
    const observer = new ResizeObserver(() => {
      measure();
      frame.postRender(update);
    });
    observer.observe(label);
    return () => {
      observer.disconnect();
      cancelFrame(update);
    };
  }, [labelRef, measure, update]);

  return {
    start,
    stop,
    viewportRef: labelRef,
    maskRef,
    contentRef,
    ringRef,
  };
}
