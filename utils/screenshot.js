const puppeteer = require('puppeteer');

async function takeScreenshot(url) {
  const fileName = Date.now();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  let screenshot = await page.screenshot({
    path: `./public/${fileName}.png`,
    fullPage: true
  });

  await browser.close();

  return { screenshot, fileName };
}

module.exports = takeScreenshot;