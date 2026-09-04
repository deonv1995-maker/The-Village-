import { chromium } from 'playwright-core';

const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');

  const bootError = await page.locator('.boot-error').count();
  if (bootError > 0) {
    throw new Error('The Village rendered its boot-error fallback instead of the game.');
  }

  await page.mouse.move(720, 500);
  await page.mouse.wheel(0, -3200);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'villager-preview.png', fullPage: true });

  if (pageErrors.length > 0) {
    throw new Error(`Page errors:\n${pageErrors.join('\n')}`);
  }
} finally {
  await browser.close();
}
