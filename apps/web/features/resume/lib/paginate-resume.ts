export type SectionPlan = {
  lineHeight: number;
  breakBefore: boolean;
  keepWhole: boolean;
};

type PaginateInput = {
  headerHeight: number;
  sectionHeights: number[];
  leadHeights: number[];
  pageContentHeight: number;
  defaultLineHeight: number;
  minLineHeight: number;
  overflowLineCount: number;
  linePx: number;
};

/**
 * Walks remaining page space and decides, per section, whether to start on a
 * new page, squeeze line-height to absorb a small overflow, or allow a split.
 */
export function planResumePagination({
  headerHeight,
  sectionHeights,
  leadHeights,
  pageContentHeight,
  defaultLineHeight,
  minLineHeight,
  overflowLineCount,
  linePx,
}: PaginateInput): SectionPlan[] {
  const overflowBudget = overflowLineCount * linePx;
  let remaining = Math.max(0, pageContentHeight - headerHeight);

  return sectionHeights.map((height, index) => {
    const leadHeight = leadHeights[index] ?? height;
    const plan = planSection({
      height,
      leadHeight,
      remaining,
      pageContentHeight,
      defaultLineHeight,
      minLineHeight,
      overflowBudget,
    });

    remaining = leftoverAfter(
      height * (plan.lineHeight / defaultLineHeight),
      plan.breakBefore ? pageContentHeight : remaining,
      pageContentHeight
    );

    return plan;
  });
}

function planSection({
  height,
  leadHeight,
  remaining,
  pageContentHeight,
  defaultLineHeight,
  minLineHeight,
  overflowBudget,
}: {
  height: number;
  leadHeight: number;
  remaining: number;
  pageContentHeight: number;
  defaultLineHeight: number;
  minLineHeight: number;
  overflowBudget: number;
}): SectionPlan {
  const keepWhole = height <= pageContentHeight;
  const squeezed = squeezedLineHeight(
    height,
    remaining,
    defaultLineHeight,
    minLineHeight
  );

  if (height <= remaining) {
    return { lineHeight: defaultLineHeight, breakBefore: false, keepWhole };
  }

  // Heading plus the first block would sit alone at the bottom. Move it.
  if (remaining < leadHeight) {
    return planOnFreshPage({
      height,
      pageContentHeight,
      defaultLineHeight,
      minLineHeight,
      overflowBudget,
      keepWhole,
    });
  }

  if (squeezed !== undefined && height - remaining <= overflowBudget) {
    return { lineHeight: squeezed, breakBefore: false, keepWhole: true };
  }

  if (keepWhole) {
    return planOnFreshPage({
      height,
      pageContentHeight,
      defaultLineHeight,
      minLineHeight,
      overflowBudget,
      keepWhole,
    });
  }

  return {
    lineHeight: defaultLineHeight,
    breakBefore: false,
    keepWhole: false,
  };
}

function planOnFreshPage({
  height,
  pageContentHeight,
  defaultLineHeight,
  minLineHeight,
  overflowBudget,
  keepWhole,
}: {
  height: number;
  pageContentHeight: number;
  defaultLineHeight: number;
  minLineHeight: number;
  overflowBudget: number;
  keepWhole: boolean;
}): SectionPlan {
  if (height <= pageContentHeight) {
    const squeezed = squeezedLineHeight(
      height,
      pageContentHeight,
      defaultLineHeight,
      minLineHeight
    );

    if (
      squeezed !== undefined &&
      height - pageContentHeight > 0 &&
      height - pageContentHeight <= overflowBudget
    ) {
      return { lineHeight: squeezed, breakBefore: true, keepWhole: true };
    }

    return { lineHeight: defaultLineHeight, breakBefore: true, keepWhole };
  }

  return { lineHeight: defaultLineHeight, breakBefore: true, keepWhole: false };
}

function squeezedLineHeight(
  height: number,
  target: number,
  defaultLineHeight: number,
  minLineHeight: number
) {
  if (target <= 0 || height <= target) return undefined;

  const scaled = defaultLineHeight * (target / height);
  if (scaled < minLineHeight) return undefined;

  return scaled;
}

function leftoverAfter(
  height: number,
  startRemaining: number,
  pageHeight: number
) {
  let left = height;
  let remaining = startRemaining;

  while (left > 0.5) {
    const take = Math.min(left, remaining);
    left -= take;
    remaining -= take;

    if (left > 0.5) remaining = pageHeight;
  }

  return remaining;
}
