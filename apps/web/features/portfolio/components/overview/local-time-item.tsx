'use client';

import { useEffect, useId, useState } from 'react';

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
} from '@/components/cheffolio/intro-item';
import { InlineScript } from '@/components/inline-script';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type CurrentLocalTimeItemProps = {
  timeZone: string;
};

export function LocalTimeItem({ timeZone }: CurrentLocalTimeItemProps) {
  const id = useId();
  const ids = {
    time: `lt-time-${id}`,
    diff: `lt-diff-${id}`,
    hands: `lt-hands-${id}`,
  };
  const [timeString, setTimeString] = useState<string>('');
  const [diffText, setDiffText] = useState<string>('');
  // Deterministic 12:00 for SSR, the inline script corrects it before paint.
  const [handsPath, setHandsPath] = useState<string>(() =>
    clockHandsPath(12, 0)
  );

  useEffect(() => {
    const updateTime = () => {
      const { time, hour, minute, diff } = computeClock(timeZone);
      setTimeString(time);
      setDiffText(diff);
      setHandsPath(clockHandsPath(hour, minute));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [timeZone]);

  return (
    <IntroItem>
      <IntroItemIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path id={ids.hands} d={handsPath} suppressHydrationWarning />
        </svg>
      </IntroItemIcon>

      <IntroItemContent aria-label={`Current local time: ${timeString}`}>
        <Tooltip>
          <TooltipTrigger
            render={
              <span
                id={ids.time}
                className="cursor-default"
                suppressHydrationWarning
              />
            }
          >
            {timeString}
          </TooltipTrigger>
          <TooltipContent>{timeZone}</TooltipContent>
        </Tooltip>

        <span
          id={ids.diff}
          className="text-muted-foreground"
          aria-hidden
          suppressHydrationWarning
        >
          {diffText}
        </span>
      </IntroItemContent>

      <InlineScript html={getInlineScript(timeZone, ids)} />
    </IntroItem>
  );
}

function clockHandsPath(hour: number, minute: number) {
  const h = hour % 12;
  const round = (n: number) => Math.round(n * 1000) / 1000;

  const minuteAngle = (minute / 60) * 2 * Math.PI;
  const hourAngle = ((h + minute / 60) / 12) * 2 * Math.PI;

  const hx = round(12 + 3.6 * Math.sin(hourAngle));
  const hy = round(12 - 3.6 * Math.cos(hourAngle));
  const mx = round(12 + 6 * Math.sin(minuteAngle));
  const my = round(12 - 6 * Math.cos(minuteAngle));

  return `M12 12 L${hx} ${hy} M12 12 L${mx} ${my}`;
}

function computeClock(timeZone: string) {
  const now = new Date();

  const time = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now);
  const hour = parseInt(time, 10);
  const minute = parseInt(time.slice(3), 10);

  // tz offset = (tz wall-clock instant) − (UTC wall-clock instant), each read
  // back as a local Date. In minutes, positive = east of UTC.
  const viewerOffset = -now.getTimezoneOffset();
  const targetOffset =
    (new Date(now.toLocaleString('en-US', { timeZone })).getTime() -
      new Date(now.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()) /
    60000;
  const hoursDiff = Math.abs(targetOffset - viewerOffset) / 60;
  const diff =
    hoursDiff < 1
      ? ' // same time'
      : ` // ${Math.floor(hoursDiff)}h ${targetOffset > viewerOffset ? 'ahead' : 'behind'}`;

  return { time, hour, minute, diff };
}

type ClockIds = { time: string; diff: string; hands: string };

function runClockScript(
  timeZone: string,
  ids: ClockIds,
  compute: typeof computeClock,
  handsPath: typeof clockHandsPath
) {
  try {
    const { time, diff, hour, minute } = compute(timeZone);
    const t = document.getElementById(ids.time);
    if (t) t.textContent = time;
    const d = document.getElementById(ids.diff);
    if (d) d.textContent = diff;
    const p = document.getElementById(ids.hands);
    if (p) p.setAttribute('d', handsPath(hour, minute));
  } catch {}
}

/**
 * Blocking inline script that paints the viewer-local clock before hydration
 * (Next.js "prevent flash before hydration"). Sharing `computeClock` with the
 * effect guarantees the pre-hydration value matches what React renders.
 */
function getInlineScript(timeZone: string, ids: ClockIds) {
  return `(${runClockScript.toString()})(${JSON.stringify(timeZone)},${JSON.stringify(ids)},${computeClock.toString()},${clockHandsPath.toString()})`;
}
