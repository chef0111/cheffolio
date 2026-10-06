function getCSSVariable(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function initColors() {
  return {
    background: getCSSVariable('--nf-background'),
    foreground: getCSSVariable('--nf-foreground'),
    mutedForeground: getCSSVariable('--nf-muted-foreground'),
    brick: getCSSVariable('--nf-brick'),
    brickHighlight: getCSSVariable('--nf-brick-highlight'),
    brickShadow: getCSSVariable('--nf-brick-shadow'),
  } as const;
}

export let Colors = {} as ReturnType<typeof initColors>;

export function loadColors() {
  Colors = initColors();
}
