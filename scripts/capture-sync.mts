import path from 'node:path';

import { getR2ClientFromEnv, syncDirToR2 } from './lib/r2.mts';

const screenshotsDir = path.join(process.cwd(), '.cheffolio/screenshots');

async function main() {
  const client = getR2ClientFromEnv();

  const keys = await syncDirToR2({
    client,
    dir: screenshotsDir,
    extensions: ['.webp', '.png', '.jpg', '.jpeg'],
  });

  if (keys.length === 0) {
    console.log('No screenshots found to sync.');
    return;
  }

  for (const key of keys) {
    console.log(`Uploaded: ${key}`);
  }

  function getSyncedMessage(screenshotCount: number) {
    if (screenshotCount === 1) {
      return 'Synced 1 screenshot.';
    }

    return `Synced ${screenshotCount} screenshots.`;
  }

  console.log(getSyncedMessage(keys.length));
}

main().catch((error) => {
  console.error('Error syncing screenshots:', error);
  process.exit(1);
});
