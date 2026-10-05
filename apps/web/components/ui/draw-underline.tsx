'use client';

import * as React from 'react';

type DrawUnderlineProps = React.ComponentPropsWithoutRef<'a'> & {
  /**
   * The element to render. Default `span` for decorating text; pass `a` when this IS the
   * link.
   *
   * This exists for G9 and not for flexibility. Focus does not travel down the tree, so a
   * `span` wrapped in someone else's `<a>` never sees that link's focus and a keyboard user
   * gets nothing. Rendering as the anchor puts the handlers on the focusable element
   * itself, which is the only arrangement where the keyboard path works.
   *
   * `button` is deliberately not offered. The props here are the anchor's set, which is a
   * superset of `span`'s but not of `button`'s — `disabled`, `form` and `value` would not
   * type-check, and offering a tag whose own attributes the type rejects is worse than not
   * offering it. For a button, render this as a `span` inside your `<button>` and drive the
   * keyboard state from the button's own `:focus-visible`.
   */
  as?: 'span' | 'a';
  /** Thickness of the rule, in px. */
  thickness?: number;
  /** Distance below the text baseline box, in em, so it scales with the type. */
  offset?: string;
  /** Colour of the rule. Defaults to currentColor so it inherits the link's own colour. */
  color?: string;
};

/** Draw. G3's enter band is 180-260ms. */
const DRAW_MS = 220;
/**
 * Retract. G3's release band is 350-450ms, and its note pairs that band with the spring —
 * which is wrong for this property. A spring overshoots past its target, and past zero
 * width is a negative scale: the rule would flip and grow back out mirrored, a visible
 * artifact rather than momentum. The out-curve is one of G2's three and decays cleanly to
 * nothing, so the asymmetry G4 asks for is carried by the durations alone.
 */
const RETRACT_MS = 380;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** The rule as the fraction of the host it covers, from `a` to `b`. Rest is a zero-width span. */
type Span = { a: number; b: number };

const LEFT: Span = { a: 0, b: 0 };
const RIGHT: Span = { a: 1, b: 1 };
const CENTRE: Span = { a: 0.5, b: 0.5 };
const FULL: Span = { a: 0, b: 1 };

/**
 * Technique (SCOPE §10, G5, G12, G15).
 *
 * The rule is described as the span it covers — `translateX(a) scaleX(b - a)` off a fixed
 * left origin — rather than as a scale with a flipped `transform-origin`.
 *
 * SCOPE §10's `*Technique:*` line suggests flipping the origin, and that is the obvious
 * reading, but it cannot express an interrupted gesture. Flipping the origin at scale `s`
 * moves the painted span by `(1 - s)` of the host in a single frame: leave a link 40% drawn
 * and the rule jumps from the first 40% of the word to the last 40%. Guarding the flip
 * behind "only when fully drawn" trades that jump for a worse one, because roughly half of
 * ordinary pass-through sweeps are still in flight when the pointer exits, and those then
 * rewind toward the edge they came from — the opposite of what SCOPE §10's Intent
 * describes, and the Intent is what binds. A span has no such problem: any partial state is
 * representable, so every transition is continuous and the retract always heads for the
 * edge the pointer actually left by. Still transform-only, so still G12.
 *
 * G5, and the reason `armTo` looks the way it does: setting `transition: none` and forcing
 * a reflow *cancels* a running transition, and a cancelled transition reverts to its
 * specified value — the previous target, not the value on screen. Interrupt a draw without
 * pinning first and the rule snaps to full width before it retracts. So `armTo` reads the
 * live span off the matrix, writes it back while transitions are off, and only then arms
 * the new one. Measured: interrupting a 600ms linear draw at 0.333 without the pin lands on
 * 1.0; with it, 0.333.
 *
 * G6 — the rest state is a zero-width span, which is the one place scaling from nothing is
 * right: a rule is progressively revealed from an edge, not popped into existence, and a
 * non-zero rest would leave a permanent dot under the text.
 */
export function DrawUnderline({
  as = 'span',
  thickness = 1,
  offset = '-0.14em',
  color = 'currentColor',
  className,
  children,
  ...props
}: DrawUnderlineProps) {
  // Narrowed so the spread type-checks against this component's props. The runtime value is
  // whichever tag was asked for; both members of the union accept the anchor's attributes.
  const Tag = as as 'a';
  const host = React.useRef<HTMLAnchorElement>(null);
  const rule = React.useRef<HTMLSpanElement>(null);
  /** Hover and focus are held apart so neither one's exit cancels the other. */
  const hovering = React.useRef(false);
  const focused = React.useRef(false);

  const css = (s: Span) =>
    `translateX(${(s.a * 100).toFixed(3)}%) scaleX(${Math.max(0, s.b - s.a).toFixed(4)})`;

  /** The live span, decomposed from the matrix so an interrupted gesture can continue. */
  const spanNow = (el: HTMLElement, width: number): Span => {
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    const a = width > 0 ? m.e / width : 0;
    return { a, b: a + m.a };
  };

  /**
   * Pin whatever is on screen, then animate to `to`. `animated: false` commits `to` with no
   * transition at all, which is how the reduced-motion path arrives without movement.
   */
  const armTo = (to: Span, ms: number, animated: boolean, from?: Span) => {
    const el = rule.current;
    if (!el) return;
    const width = host.current?.getBoundingClientRect().width ?? 0;
    const live = from ?? spanNow(el, width);
    el.style.transition = 'none';
    el.style.transform = css(live);
    if (animated) {
      void el.offsetWidth;
      el.style.transition = `transform ${ms}ms ${EASE}`;
    }
    el.style.transform = css(to);
  };

  /** Which vertical edge of the host the pointer is nearer. */
  const edge = (clientX: number): Span => {
    const box = host.current?.getBoundingClientRect();
    if (!box) return LEFT;
    return clientX < box.left + box.width / 2 ? LEFT : RIGHT;
  };

  /** Arriving: anchor a collapsed rule to the entry edge, then grow it to full width. */
  const arrive = (side: Span, animated: boolean) => {
    const el = rule.current;
    if (!el) return;
    const width = host.current?.getBoundingClientRect().width ?? 0;
    const live = spanNow(el, width);
    // Only re-anchor when there is nothing on screen to be continuous with. Mid-retract,
    // the rule grows back out of wherever it currently is.
    armTo(FULL, DRAW_MS, animated, live.b - live.a < 0.01 ? side : live);
  };

  const enter = (event: React.PointerEvent<HTMLAnchorElement>) => {
    // G7 — read capability here rather than holding it in state: it only gates handler
    // work, so it must never decide what renders. A tap fires pointerenter and keeps it,
    // so without this the rule would latch drawn on a phone.
    if (!window.matchMedia(FINE_POINTER).matches) return;
    hovering.current = true;
    // G10 — under reduced motion the rule still appears; only the drawing goes.
    arrive(edge(event.clientX), window.matchMedia(MOTION_OK).matches);
  };

  const leave = (event: React.PointerEvent<HTMLAnchorElement>) => {
    // A touch pointer being destroyed fires pointerleave even though enter() bailed.
    if (!hovering.current) return;
    hovering.current = false;
    if (focused.current) return;
    // Unconditional: the span representation makes this continuous from any in-flight
    // state, so the rule always retracts toward the edge the pointer actually left by.
    armTo(
      edge(event.clientX),
      RETRACT_MS,
      window.matchMedia(MOTION_OK).matches
    );
  };

  /**
   * G9 — a keyboard user has no cursor, so there is no side to have come from. The rule
   * arrives from the centre outward, which is the honest answer to "no direction known"
   * rather than a borrowed left-to-right implying movement that never happened.
   */
  const focus = (event: React.FocusEvent<HTMLAnchorElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(':focus-visible'))
      return;
    focused.current = true;
    arrive(CENTRE, window.matchMedia(MOTION_OK).matches);
  };

  const blur = (event: React.FocusEvent<HTMLAnchorElement>) => {
    if (!focused.current) return;
    if (
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      return;
    }
    focused.current = false;
    if (hovering.current) return;
    // G8 — a device with no hover can still have a keyboard (a tablet with one attached, a
    // D-pad browser). Retracting to a literal zero there would overwrite the var-driven
    // resting rule for good, and this link alone would sit undrawn while every other one on
    // the page rests drawn. Hand the rest state back to the variable instead.
    if (!window.matchMedia(FINE_POINTER).matches) {
      const el = rule.current;
      if (el) {
        el.style.transition = 'none';
        el.style.transform = 'translateX(0%) scaleX(var(--hui-rest))';
      }
      return;
    }
    armTo(CENTRE, RETRACT_MS, window.matchMedia(MOTION_OK).matches);
  };

  return (
    <Tag
      // G8/props — the spread comes first so a consumer's own handlers run (composed
      // below) but can never replace the ones the effect needs to reach its rest state.
      {...props}
      ref={host}
      onPointerEnter={(e) => {
        props.onPointerEnter?.(e);
        enter(e);
      }}
      onPointerLeave={(e) => {
        props.onPointerLeave?.(e);
        leave(e);
      }}
      onFocus={(e) => {
        props.onFocus?.(e);
        focus(e);
      }}
      onBlur={(e) => {
        props.onBlur?.(e);
        blur(e);
      }}
      className={[
        // G11 — with `as="a"` this IS the pressable thing, so the press response belongs
        // here rather than in the preview, the way every button effect in this library
        // ships its own. `:active` does not match descendants, so these are inert for the
        // `span` default and need no branching. Base rule names `transform` so the release
        // has it in its property list and does not snap; the press takes its own shorter
        // band so it never inherits the settle.
        '[transition:transform_380ms_cubic-bezier(0.23,1,0.32,1)]',
        'active:[transform:scale(0.97)] active:[transition:transform_140ms_cubic-bezier(0.23,1,0.32,1)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...props.style,
        // Pinned after the consumer's style: the rule is positioned against this box, so
        // these two are what the effect is made of. The rule's own declarations are written
        // inline by the handlers above, so those are not durably overridable either — the
        // first pointer event replaces them.
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {children}
      {/*
       * The rule.
       *
       * G8 — where there is no hover to give, it rests drawn rather than absent, so a link
       * on a phone still reads as a link. Written as the exact complement of the pointer
       * gate rather than `pointer-coarse`, which is not its complement: a pen reports a fine
       * pointer with no hover and would match neither. Doubled so it beats the resting
       * declaration, since a media query adds no specificity (G16).
       */}
      <span
        ref={rule}
        aria-hidden="true"
        className="[--hui-rest:0] [@media_not_all_and_(hover:hover)_and_(pointer:fine)]:[&&]:[--hui-rest:1]"
        style={{
          position: 'absolute',
          insetInline: 0,
          bottom: offset,
          height: `${thickness}px`,
          background: color,
          pointerEvents: 'none',
          transformOrigin: 'left',
          transform: 'translateX(0%) scaleX(var(--hui-rest))',
        }}
      />
    </Tag>
  );
}
