import { expect, test } from 'bun:test';

import { parseResumeEntries } from '../parse-resume-entries';

test('turns metadata blocks into Markdown headings and retains their details', () => {
  const source = `## Projects

--
title="First"
date="2026"
--

- First bullet

--
title="Second"
--

- Second bullet

## Skills`;

  const result = parseResumeEntries(source);

  expect(result.content).toBe(`## Projects

### First

- First bullet

### Second

- Second bullet

## Skills`);
  expect(result.entries).toEqual([
    { title: 'First', date: '2026' },
    { title: 'Second' },
  ]);
});

test('rejects malformed entry metadata', () => {
  expect(() =>
    parseResumeEntries('--\nsubtitle="Missing title"\n--')
  ).toThrow();
  expect(() => parseResumeEntries('--\ntitle="Unclosed"')).toThrow();
  expect(() => parseResumeEntries('--\ntitle="A"\ntitle="B"\n--')).toThrow();
});
