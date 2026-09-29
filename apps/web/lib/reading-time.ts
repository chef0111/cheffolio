/**
 * Estimate reading time for Markdown/MDX blog content.
 *
 * Inspired by Medium's word + image model, with slower pacing for fenced
 * code (dev blogs are skimmed line-by-line, not at prose WPM).
 *
 * @see https://blog.medium.com/read-time-and-you-bc2048ab620c
 */

/** Adult English reading speed used for prose. */
const PROSE_WORDS_PER_MINUTE = 225;

/**
 * Seconds spent on each non-empty code line.
 * Roughly ~80–100 "words"/min when averaged over typical lines.
 */
const CODE_SECONDS_PER_LINE = 2.5;

/** Flat overhead when opening a fenced code block (context switch). */
const CODE_BLOCK_OVERHEAD_SECONDS = 8;

/** Medium: 12s first image, −1s each next, floor 3s after the 10th. */
const IMAGE_FIRST_SECONDS = 12;
const IMAGE_MIN_SECONDS = 3;
const IMAGE_TAPER_AFTER = 10;

const FENCED_CODE_RE =
  /^(?<fence>`{3,}|~{3,})[^\n]*\n(?<code>[\s\S]*?)^\k<fence>[ \t]*$/gm;

const MARKDOWN_IMAGE_RE = /!\[[^\]]*]\([^)]+\)/g;
const HTML_IMAGE_RE = /<img\b[^>]*>/gi;
const MDX_IMPORT_EXPORT_RE = /^\s*(?:import|export)\b.*$/gm;
const JSX_TAG_RE = /<\/?[A-Za-z][\w.-]*(?:\s[^>]*)?\/?>/g;
const MARKDOWN_LINK_RE = /\[([^\]]+)]\([^)]+\)/g;
const INLINE_CODE_RE = /`[^`]+`/g;
const MARKDOWN_EMPHASIS_RE = /[*_~]+/g;
const HEADING_MARKER_RE = /^#{1,6}\s+/gm;
const BLOCKQUOTE_MARKER_RE = /^>\s?/gm;
const LIST_MARKER_RE = /^\s*[-*+]\s+|^\s*\d+\.\s+/gm;
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g;

export type ReadingTimeEstimate = {
  /** Rounded-up minutes to display (minimum 1). */
  minutes: number;
  /** Exact minutes before rounding. */
  minutesExact: number;
  /** Prose word count (code excluded). */
  words: number;
  /** Non-empty lines across all fenced code blocks. */
  codeLines: number;
  /** Number of fenced code blocks. */
  codeBlocks: number;
  /** Markdown + HTML images. */
  images: number;
};

export type ReadingTimeOptions = {
  proseWordsPerMinute?: number;
  codeSecondsPerLine?: number;
  codeBlockOverheadSeconds?: number;
};

export function estimateReadingTime(
  content: string,
  options: ReadingTimeOptions = {}
): ReadingTimeEstimate {
  const proseWpm = options.proseWordsPerMinute ?? PROSE_WORDS_PER_MINUTE;
  const codeSecondsPerLine =
    options.codeSecondsPerLine ?? CODE_SECONDS_PER_LINE;
  const codeBlockOverhead =
    options.codeBlockOverheadSeconds ?? CODE_BLOCK_OVERHEAD_SECONDS;

  const { prose, codeBlocks, images } = splitContent(content);

  const words = countWords(prose);
  const codeLines = codeBlocks.reduce(
    (total, block) => total + countNonEmptyLines(block),
    0
  );

  const proseMinutes = words / proseWpm;
  const codeMinutes =
    (codeBlocks.length * codeBlockOverhead + codeLines * codeSecondsPerLine) /
    60;
  const imageMinutes = imageReadSeconds(images) / 60;

  const minutesExact = proseMinutes + codeMinutes + imageMinutes;
  const minutes = Math.max(1, Math.ceil(minutesExact));

  return {
    minutes,
    minutesExact,
    words,
    codeLines,
    codeBlocks: codeBlocks.length,
    images,
  };
}

/** Display label, e.g. `5 min read`. */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

function splitContent(content: string) {
  const codeBlocks: string[] = [];
  let proseParts = '';
  let lastIndex = 0;

  const re = new RegExp(FENCED_CODE_RE.source, FENCED_CODE_RE.flags);
  let match: RegExpExecArray | null;

  while ((match = re.exec(content)) !== null) {
    proseParts += content.slice(lastIndex, match.index);
    codeBlocks.push(match.groups?.code ?? '');
    lastIndex = match.index + match[0].length;
  }

  proseParts += content.slice(lastIndex);

  return {
    prose: stripMarkup(proseParts),
    codeBlocks,
    images: countImages(proseParts),
  };
}

function countImages(text: string) {
  const markdown = text.match(MARKDOWN_IMAGE_RE)?.length ?? 0;
  const html = text.match(HTML_IMAGE_RE)?.length ?? 0;
  return markdown + html;
}

function stripMarkup(text: string) {
  return text
    .replace(HTML_COMMENT_RE, ' ')
    .replace(MDX_IMPORT_EXPORT_RE, ' ')
    .replace(MARKDOWN_IMAGE_RE, ' ')
    .replace(MARKDOWN_LINK_RE, '$1')
    .replace(JSX_TAG_RE, ' ')
    .replace(INLINE_CODE_RE, ' ')
    .replace(HEADING_MARKER_RE, '')
    .replace(BLOCKQUOTE_MARKER_RE, '')
    .replace(LIST_MARKER_RE, '')
    .replace(MARKDOWN_EMPHASIS_RE, '')
    .replace(/[#>[\](){}|\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text: string) {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function countNonEmptyLines(code: string) {
  if (!code) return 0;
  return code.split('\n').filter((line) => line.trim().length > 0).length;
}

function imageReadSeconds(count: number) {
  let seconds = 0;

  for (let i = 0; i < count; i++) {
    if (i < IMAGE_TAPER_AFTER) {
      seconds += Math.max(IMAGE_MIN_SECONDS, IMAGE_FIRST_SECONDS - i);
    } else {
      seconds += IMAGE_MIN_SECONDS;
    }
  }

  return seconds;
}
