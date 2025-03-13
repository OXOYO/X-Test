const puppeteer = require('puppeteer');

async function scrapeImages(pageUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

  // 获取页面上的所有图片的 URL
  const images = await page.evaluate(() => {
    const imageElements = document.querySelectorAll('img');
    return Array.from(imageElements).map(img => img.src);
  });

  console.log(images);
  await browser.close();
}

scrapeImages('https://www.bing.com/');
