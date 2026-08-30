import fs from 'node:fs';
import path from 'node:path';

import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';

const DEFAULT_ORIGIN = 'https://cheffolio.localhost';
const outputDir = path.join(process.cwd(), '.cheffolio/screenshots');

const SIZE = {
  desktop: {
    width: 1280,
    height: 720,
  },
  mobile: {
    width: 440,
    height: 956,
  },
  'og-image': {
    width: 1200,
    height: 630,
  },
} as const;

type Theme = 'light' | 'dark';
type Size = keyof typeof SIZE;
type ScreenshotType = 'webp' | 'png';

type CaptureJob = {
  name: string;
  path: string;
  size: Size;
  themes: readonly Theme[];
  type: ScreenshotType;
  deviceScaleFactor?: number;
  readySelector?: string;
};

// Set desktop and mobile screenshots to 1.4x DPR to
// prevent brand mark from dropping subpixel strokes.
// It just works, don't ask why.
const JOBS = [
  {
    name: 'screenshot',
    path: '/',
    size: 'desktop',
    themes: ['light', 'dark'],
    type: 'webp',
    deviceScaleFactor: 1.4,
    readySelector: '[aria-label="GitHub contributions"]',
  },
  {
    name: 'screenshot',
    path: '/',
    size: 'mobile',
    themes: ['light', 'dark'],
    type: 'webp',
    deviceScaleFactor: 1.4,
    readySelector: '[aria-label="GitHub contributions"]',
  },
  {
    name: 'screenshot',
    path: '/og',
    size: 'og-image',
    themes: ['light', 'dark'],
    type: 'png',
  },
] as const satisfies readonly CaptureJob[];

function screenshotPath(job: CaptureJob, theme: Theme) {
  const fileName = `${job.name}-${job.size}-${theme}.${job.type}`;
  return path.join(outputDir, fileName) as `${string}.webp` | `${string}.png`;
}

async function applyTheme(page: Page, theme: Theme) {
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: theme },
  ]);
  await page.evaluate((nextTheme) => {
    localStorage.setItem('theme', nextTheme);
  }, theme);
}

async function waitUntilReady(page: Page, job: CaptureJob) {
  if (job.readySelector) {
    await page.waitForSelector(job.readySelector);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      })
  );
}

async function assertTheme(page: Page, theme: Theme) {
  const resolved = await page.evaluate(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  if (resolved !== theme) {
    throw new Error(`Theme mismatch: wanted ${theme}, got ${resolved}`);
  }
}

async function hideNextjsPortal(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('nextjs-portal').forEach((el) => el.remove());
  });
}

async function captureScreenshot({
  browser,
  origin,
  job,
  skipExisting,
}: {
  browser: Browser;
  origin: string;
  job: CaptureJob;
  skipExisting: boolean;
}) {
  const page = await browser.newPage();
  const { width, height } = SIZE[job.size];
  await page.setViewport({
    width,
    height,
    deviceScaleFactor: job.deviceScaleFactor ?? 1,
  });

  const href = new URL(job.path, origin).href;
  await page.goto(href, { waitUntil: 'networkidle0' });

  for (const theme of job.themes) {
    const filePath = screenshotPath(job, theme);

    if (skipExisting && fs.existsSync(filePath)) {
      console.log('Screenshot already exists, skipping:', filePath);
      continue;
    }

    await applyTheme(page, theme);
    await page.reload({ waitUntil: 'networkidle0' });
    await waitUntilReady(page, job);
    await assertTheme(page, theme);
    await hideNextjsPortal(page);

    await page.screenshot({
      path: filePath,
      type: job.type,
      quality: job.type !== 'png' ? 90 : undefined,
    });

    console.log('Screenshot saved:', filePath);
  }

  await page.close();
}

async function main() {
  const origin = process.env.URL || DEFAULT_ORIGIN;
  const skipExisting = process.argv.includes('--skip-existing');

  await fs.promises.mkdir(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    args: ['--ignore-certificate-errors'],
    acceptInsecureCerts: true,
  });

  try {
    for (const job of JOBS) {
      await captureScreenshot({ browser, origin, job, skipExisting });
    }
    console.log('All screenshots captured successfully.');
  } catch (error) {
    console.error('Error capturing screenshots:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }

  if (process.exitCode === 1) {
    process.exit(1);
  }
}

main();
