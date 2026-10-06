'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionValueEvent,
} from 'motion/react';
import * as React from 'react';

import { Popover, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import {
  EASE_OUT,
  LABEL_VERTICAL_PADDING,
  useScrollProgress,
} from '@/hooks/scroll-progress/use-scroll-progress';
import {
  useActiveLinkScroll,
  useTocScroll,
} from '@/hooks/scroll-progress/use-toc-scroll';
import { useTriggerLabelReveal } from '@/hooks/scroll-progress/use-trigger-label-reveal';
import { cn } from '@/lib/utils';
import type {
  ScrollProgressProps,
  ScrollProgressSection,
  SectionLabelMotion,
} from '@/types/scroll-progress';

type ScrollProgressContextValue = ReturnType<typeof useScrollProgress>;
const ScrollProgressContext =
  React.createContext<ScrollProgressContextValue | null>(null);

function useScrollProgressContext() {
  const context = React.use(ScrollProgressContext);
  if (!context)
    throw new Error(
      'Scroll progress components must be inside ScrollProgress.'
    );
  return context;
}

export function ScrollProgress({
  className,
  sections,
  containerRef,
  offset = 160.5,
  ...props
}: ScrollProgressProps) {
  const controller = useScrollProgress({ sections, containerRef, offset });
  if (!controller.state.activeSection) return null;

  return (
    <ScrollProgressContext value={controller}>
      <div
        data-slot="scroll-progress"
        className={cn(
          'fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-1/2 z-100 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 font-sans sm:bottom-[calc(env(safe-area-inset-bottom)+1.5rem)]',
          className
        )}
        {...props}
      >
        <motion.div layoutRoot className="relative">
          <ScrollProgressBackground />
          <Popover
            open={controller.state.open}
            onOpenChange={controller.actions.onOpenChange}
          >
            <ScrollProgressTrigger />
            <ScrollProgressContent />
          </Popover>
        </motion.div>
      </div>
    </ScrollProgressContext>
  );
}

function ScrollProgressBackground() {
  const {
    state: { surfaceSize, sizes, layoutTransition },
  } = useScrollProgressContext();
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
      aria-hidden
    >
      <motion.div
        data-slot="scroll-progress-background"
        layout
        initial={false}
        className="bg-surface ring-foreground/10 border-border/50 border shadow-sm ring-1"
        style={{
          width: surfaceSize.width,
          height: surfaceSize.height,
          borderRadius: sizes.trigger.height / 2,
        }}
        transition={layoutTransition}
      />
    </div>
  );
}

function ScrollProgressTrigger() {
  const {
    state: {
      open,
      keyboardInteraction,
      sizes,
      layoutTransition,
      activeSection,
      labelMotion,
      scrollYProgress,
    },
    actions: { setKeyboardInteraction },
    meta: { triggerRef },
  } = useScrollProgressContext();
  const {
    start: startReveal,
    stop: stopReveal,
    viewportRef,
    maskRef,
    contentRef,
    ringRef,
  } = useTriggerLabelReveal({
    triggerRef,
    open,
    popupWidth: sizes.popup.width,
  });
  if (!activeSection) return null;

  return (
    <PopoverTrigger
      ref={triggerRef}
      render={
        <motion.button
          layout
          transition={layoutTransition}
          onLayoutAnimationStart={startReveal}
          onLayoutAnimationComplete={stopReveal}
        />
      }
      style={open ? { width: sizes.popup.width } : undefined}
      aria-label={open ? 'Hide table of contents' : 'Show table of contents'}
      onKeyDown={() => setKeyboardInteraction(true)}
      onPointerDown={() => setKeyboardInteraction(false)}
      className={cn(
        'text-surface-foreground relative flex h-12 items-center gap-4 rounded-full pr-3 pl-4 text-left text-base font-medium outline-none',
        !open && 'max-w-64 min-w-44',
        keyboardInteraction && 'transition-none active:scale-100'
      )}
    >
      <motion.span
        layout="position"
        transition={layoutTransition}
        aria-hidden
        className="bg-foreground size-2 shrink-0 rounded-full"
      />
      <motion.span
        ref={viewportRef}
        layout="position"
        transition={layoutTransition}
        data-slot="scroll-progress-label-viewport"
        className="flex min-w-0 flex-1 self-stretch overflow-hidden"
        style={{ marginBlock: LABEL_VERTICAL_PADDING }}
      >
        <span
          ref={maskRef}
          data-slot="scroll-progress-label-mask"
          className="flex min-w-0 flex-1 overflow-hidden"
        >
          <span ref={contentRef} className="flex min-w-0 flex-1">
            <SectionLabel section={activeSection} motion={labelMotion} />
          </span>
        </span>
      </motion.span>
      <motion.span
        ref={ringRef}
        layout="position"
        transition={layoutTransition}
        className="shrink-0"
      >
        <ProgressRing progress={scrollYProgress} />
      </motion.span>
    </PopoverTrigger>
  );
}

function ScrollProgressContent() {
  const {
    state: { keyboardInteraction },
    meta: { setPopupElement, activeLinkRef },
  } = useScrollProgressContext();
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        side="top"
        sideOffset={0}
        positionMethod="fixed"
        collisionAvoidance={{ side: 'none', align: 'shift' }}
        className="isolate z-110"
      >
        <PopoverPrimitive.Popup
          ref={setPopupElement}
          initialFocus={(interaction) =>
            interaction === 'keyboard' ? activeLinkRef.current : false
          }
          data-slot="scroll-progress-surface"
          className={cn(
            'text-surface-foreground border-border/80 relative flex w-[min(360px,calc(100vw-2rem))] origin-(--transform-origin) flex-col overflow-hidden rounded-t-3xl border-b transition-[opacity,translate] delay-150 duration-100 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none data-ending-style:pointer-events-none data-ending-style:translate-y-1 data-ending-style:opacity-0 data-ending-style:delay-0 data-starting-style:translate-y-1 data-starting-style:opacity-0 motion-reduce:translate-none! motion-reduce:delay-0 motion-reduce:duration-120',
            keyboardInteraction && 'translate-none! transition-none!'
          )}
        >
          <PopoverTitle className="text-muted-foreground px-5 pt-4 pb-2 text-xs font-semibold uppercase">
            Table of contents
          </PopoverTitle>
          <ScrollProgressSectionList />
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function ScrollProgressSectionList() {
  const {
    state: { sections, open },
    meta: { popupElement, activeLinkRef },
  } = useScrollProgressContext();
  const listRef = React.useRef<HTMLElement>(null);
  const scroll = useTocScroll(listRef, popupElement, open);
  useActiveLinkScroll(listRef, activeLinkRef, popupElement);
  return (
    <div className="relative" onWheel={scroll.stop}>
      <nav
        ref={listRef}
        aria-label="Table of contents"
        className="no-scrollbar scroll-fade max-h-[min(360px,calc(100dvh-14rem))] overflow-y-auto overscroll-contain p-2 sm:max-h-[min(360px,calc(100dvh-10rem))]"
      >
        <TOCScrollChevron direction="up" scroll={scroll} />
        <ul className="flex flex-col gap-1">
          {sections.map((section) => (
            <li key={section.id}>
              <ScrollProgressSectionLink section={section} />
            </li>
          ))}
        </ul>
        <TOCScrollChevron direction="down" scroll={scroll} />
      </nav>
    </div>
  );
}

function ScrollProgressSectionLink({
  section,
}: {
  section: ScrollProgressSection;
}) {
  const {
    state: { activeSection, visibleHeadingIds, minimumDepth },
    actions: { selectSection },
    meta: { activeLinkRef },
  } = useScrollProgressContext();
  const active = section.id === activeSection?.id;
  const visible = visibleHeadingIds.has(section.id);
  return (
    <a
      ref={active ? activeLinkRef : undefined}
      href={'#' + encodeURIComponent(section.id)}
      aria-current={active ? 'location' : undefined}
      data-active={active}
      data-visible={visible}
      className={cn(
        'text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-ring flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-inset',
        (active || visible) && 'text-foreground',
        active && 'bg-foreground/10'
      )}
      onClick={(event) => selectSection(event, section.id)}
    >
      <span
        className="min-w-0 flex-1"
        style={{
          paddingLeft: Math.max(0, (section.depth ?? 2) - minimumDepth) * 16,
        }}
      >
        {section.label}
      </span>
      {active ? (
        <span
          aria-hidden
          className="bg-foreground size-1.5 shrink-0 rounded-full"
        />
      ) : null}
    </a>
  );
}

function TOCScrollChevron({
  direction,
  scroll,
}: {
  direction: 'up' | 'down';
  scroll: ReturnType<typeof useTocScroll>;
}) {
  const amount = direction === 'up' ? -1 : 1;
  const Icon = direction === 'up' ? ChevronUpIcon : ChevronDownIcon;
  const canScroll = direction === 'up' ? scroll.up : scroll.down;

  return (
    <button
      type="button"
      aria-label={`Scroll table of contents ${direction}`}
      aria-hidden={!canScroll}
      disabled={!canScroll}
      tabIndex={canScroll ? 0 : -1}
      data-slot={`toc-scroll-${direction}`}
      className={cn(
        'text-muted-foreground from-surface hover:text-foreground absolute inset-x-0 z-1 flex h-8 justify-center from-20% to-transparent to-100% transition-opacity duration-120 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none',
        canScroll ? 'opacity-100' : 'pointer-events-none opacity-0',
        direction === 'up'
          ? 'top-0 items-start bg-linear-to-b pt-1'
          : 'bottom-0 items-end bg-linear-to-t pb-1'
      )}
      onPointerEnter={(event) => {
        if (
          canScroll &&
          event.pointerType === 'mouse' &&
          window.matchMedia('(hover: hover) and (pointer: fine)').matches
        ) {
          scroll.start(amount);
        }
      }}
      onPointerLeave={scroll.stop}
      onPointerCancel={scroll.stop}
      onClick={() => scroll.scrollPage(amount)}
    >
      <Icon aria-hidden className="size-4 transition-colors" />
    </button>
  );
}

function labelTransform(
  { mode, edgeOffset }: SectionLabelMotion,
  direction: number
) {
  return mode === 'slide'
    ? 'translateY(calc(' +
        direction * 50 +
        '% + ' +
        direction * edgeOffset +
        'px))'
    : 'translateY(0px)';
}

function SectionLabel({
  section,
  motion: labelMotion,
}: {
  section: ScrollProgressSection;
  motion: SectionLabelMotion;
}) {
  return (
    <span className="relative flex min-w-0 flex-1 items-center text-sm">
      <span aria-hidden className="invisible block truncate">
        {section.label}
      </span>
      <AnimatePresence initial={false} custom={labelMotion}>
        <motion.span
          key={section.id}
          data-slot="scroll-progress-label"
          className="absolute inset-x-0 top-1/2 block -translate-y-1/2 truncate select-none!"
          custom={labelMotion}
          initial={labelMotion.mode === 'instant' ? false : 'enter'}
          animate="visible"
          exit="exit"
          variants={{
            enter: (config: SectionLabelMotion) => ({
              transform: labelTransform(config, config.direction),
              opacity: 0,
            }),
            visible: { transform: 'translateY(0px)', opacity: 1 },
            exit: (config: SectionLabelMotion) => ({
              transform: labelTransform(config, -config.direction),
              opacity: 0,
              transition: { duration: config.duration, ease: EASE_OUT },
            }),
          }}
          transition={{ duration: labelMotion.duration, ease: EASE_OUT }}
        >
          {section.label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function ProgressRing({ progress }: { progress: MotionValue<number> }) {
  const [percentage, setPercentage] = React.useState(() =>
    Math.round(progress.get() * 100)
  );
  useMotionValueEvent(progress, 'change', (value) => {
    setPercentage(Math.round(value * 100));
  });

  return (
    <svg
      viewBox="0 0 32 32"
      className="size-6 shrink-0 -rotate-90"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
    >
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="none"
        strokeWidth="3"
        className="stroke-foreground/30"
      />
      <motion.circle
        cx="16"
        cy="16"
        r="13"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-foreground"
        style={{ pathLength: progress }}
      />
    </svg>
  );
}

export default ScrollProgress;
