import { expect, test } from 'bun:test';

import { estimateReadingTime, formatReadingTime } from '../reading-time';

test('formatReadingTime uses the common blog label', () => {
  expect(formatReadingTime(1)).toBe('1 min read');
  expect(formatReadingTime(12)).toBe('12 min read');
});

test('empty content still reports 1 minute', () => {
  const result = estimateReadingTime('');
  expect(result.minutes).toBe(1);
  expect(result.words).toBe(0);
  expect(result.codeBlocks).toBe(0);
});

test('counts prose words and ignores markdown chrome', () => {
  const content = `
## Hello world

This is a [link](https://example.com) with **bold** text.

- one
- two
`;

  const result = estimateReadingTime(content);
  // "Hello world" + "This is a link with bold text" + "one" + "two"
  expect(result.words).toBe(11);
  expect(result.codeBlocks).toBe(0);
  expect(result.minutes).toBe(1);
});

test('extracts fenced code and bills slower than prose', () => {
  const proseOnly = 'word '.repeat(225).trim();
  const withCode = `${proseOnly}

\`\`\`ts
${Array.from({ length: 60 }, (_, i) => `const x${i} = ${i};`).join('\n')}
\`\`\`
`;

  const proseResult = estimateReadingTime(proseOnly);
  const codeResult = estimateReadingTime(withCode);

  expect(proseResult.minutes).toBe(1);
  expect(codeResult.codeBlocks).toBe(1);
  expect(codeResult.codeLines).toBe(60);
  expect(codeResult.words).toBe(225);
  // 8s overhead + 60 * 2.5s = 158s ≈ 2.63 min → ceil with 1 min prose = 4
  expect(codeResult.minutes).toBeGreaterThan(proseResult.minutes);
  expect(codeResult.minutes).toBe(4);
});

test('supports tilde fences and matching fence length', () => {
  const content = `
Intro text here.

~~~~js
function hello() {
  return true;
}
~~~~
`;

  const result = estimateReadingTime(content);
  expect(result.codeBlocks).toBe(1);
  expect(result.codeLines).toBe(3);
  expect(result.words).toBe(3);
});

test('does not count code tokens as prose words', () => {
  const content = `
Before.

\`\`\`ts
const readingTime = estimate();
const again = estimate();
\`\`\`

After.
`;

  const result = estimateReadingTime(content);
  expect(result.words).toBe(2);
  expect(result.codeLines).toBe(2);
});

test('applies Medium-style image taper', () => {
  const oneImage = '![cover](/a.png)\n\n' + 'word '.repeat(10);
  const elevenImages =
    Array.from({ length: 11 }, (_, i) => `![n${i}](/${i}.png)`).join('\n') +
    '\n\n' +
    'word '.repeat(10);

  const one = estimateReadingTime(oneImage);
  const many = estimateReadingTime(elevenImages);

  expect(one.images).toBe(1);
  expect(many.images).toBe(11);
  expect(many.minutesExact).toBeGreaterThan(one.minutesExact);
});

test('strips MDX imports and JSX from the word count', () => {
  const content = `
import { Foo } from './foo'

<Foo bar="baz" />

Readable words stay counted.
`;

  const result = estimateReadingTime(content);
  expect(result.words).toBe(4);
});

test('frontmatter-sized override path is left to document.ts; estimator stays pure', () => {
  const longProse = 'word '.repeat(900).trim();
  expect(estimateReadingTime(longProse).minutes).toBe(4);
});
