const puppeteer = require('puppeteer');

async function takeScreenshot(url) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(url);
  let screenshot = await page.screenshot({
    fullPage: true
  });

  await browser.close();

  return screenshot;
}

module.exports = takeScreenshot;