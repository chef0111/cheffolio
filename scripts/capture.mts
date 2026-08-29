import fs from 'node:fs';
import path from 'node:path';
import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';

const DEFAULT_ORIGIN = 'https://cheffolio.localhost';
const outputDir = path.join(process.cwd(), '.cheffolio/screenshots');
const SETTLE_MS = 1000;

const SIZE = {
  desktop: {
    width: 1512,
    height: 982,
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
  readySelector?: string;
};

const JOBS = [
  {
    name: 'screenshot',
    path: '/',
    size: 'desktop',
    themes: ['light', 'dark'],
    type: 'webp',
    readySelector: '[aria-label="Portfolio"]',
  },
  {
    name: 'screenshot',
    path: '/',
    size: 'mobile',
    themes: ['light', 'dark'],
    type: 'webp',
    readySelector: '[aria-label="Portfolio"]',
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
  if (!job.readySelector) return;
  await page.waitForSelector(job.readySelector);
  await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
}

async function assertTheme(page: Page, theme: Theme) {
  const resolved = await page.evaluate(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  if (resolved !== theme) {
    throw new Error(`Theme mismatch: wanted ${theme}, got ${resolved}`);
  }
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
  await page.setViewport({ width, height });

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
    await page.evaluate(() => {
      document.querySelectorAll('nextjs-portal').forEach((el) => el.remove());
    });

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
