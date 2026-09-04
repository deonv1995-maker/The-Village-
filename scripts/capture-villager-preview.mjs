import { chromium } from 'playwright-core';

const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');
  await page.mouse.move(720, 500);
  await page.mouse.wheel(0, -3200);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'villager-preview.png', fullPage: true });

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
