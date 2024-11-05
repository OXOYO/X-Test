import puppeteer from 'puppeteer';

const pageUrl = 'https://map.baidu.com/';
const zoomInSelector = '.BMap_stdMpZoomIn';
const zoomMax = 4;
const vpSize = 2
// 城市半径30公里
const radius = 30;

const timeNow = new Date().getTime()


const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setViewport({ width: 1920 * vpSize, height: 1024 * vpSize });

console.time('screencast')
// 录制视频
const recorder = await page.screencast({ path: `index/${timeNow}_recording.webm` });

console.time('goto')
await page.goto(pageUrl, { waitUntil: 'networkidle2' });
console.timeEnd('goto')


for (let i = 0; i < zoomMax; i++) {
  console.time(`click_${i}`)
  await page.waitForSelector(zoomInSelector);
  await page.click(zoomInSelector);
  // 使用 setTimeout 来模拟等待
  await new Promise(resolve => setTimeout(resolve, 1000));  // 等待1秒
  console.timeEnd(`click_${i}`)
}

console.time('waitForNetworkIdle')
await page.waitForNetworkIdle({
  concurrency: 0,
  idleTime: 1000,
});
console.timeEnd('waitForNetworkIdle')


console.time('screenshot')
await page.screenshot({ path: `index/${timeNow}_screenshot.png` });
console.timeEnd('screenshot')

// 结束视频录制
await recorder.stop();
console.timeEnd('screencast')

await browser.close();
