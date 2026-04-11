const FAB_RADIUS = 22;
const FAB_OFFSET_FROM_TOP = 4;
const NOTCH_MARGIN = 4;
const NAV_RADIUS = 16;
const NOTCH_SHOULDER = 8;

export function buildNavPath(W: number, H: number) {
  const cx = W / 2;
  const r = NAV_RADIUS;
  const er = FAB_RADIUS + NOTCH_MARGIN;
  const cy = FAB_OFFSET_FROM_TOP;
  const dx = Math.sqrt(Math.max(0, er * er - cy * cy));
  const x1 = cx - dx;
  const x2 = cx + dx;
  const sh = NOTCH_SHOULDER;

  return [
    `M ${r} 0`,
    `L ${x1 - sh} 0`,
    `Q ${x1} 0 ${x1} ${sh}`,
    `A ${er} ${er} 0 0 0 ${x2} ${sh}`,
    `Q ${x2} 0 ${x2 + sh} 0`,
    `L ${W - r} 0`,
    `Q ${W} 0 ${W} ${r}`,
    `L ${W} ${H - r}`,
    `Q ${W} ${H} ${W - r} ${H}`,
    `L ${r} ${H}`,
    `Q 0 ${H} 0 ${H - r}`,
    `L 0 ${r}`,
    `Q 0 0 ${r} 0`,
    `Z`,
  ].join(' ');
}
