import puppeteer from 'puppeteer';

const pageUrl = 'https://map.baidu.com/';
const cityCenter = { lng: 116.403874, lat: 39.914889 };  // 北京故宫的经纬度
const zoomLevel = 18;      // 缩放级别

const timeNow = new Date().getTime();
const basePath = `index5/${timeNow}`;

const waitForTimeout = async (timeout = 1000) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const browser = await puppeteer.launch();
const page = await browser.newPage();

// 打印浏览器控制台日志到 Node.js 控制台
page.on('console', msg => console.log('PAGE LOG:', msg.text()));

// 设置视口大小
await page.setViewport({ width: 1920, height: 1024 });

await page.goto(pageUrl, { waitUntil: 'networkidle2' });

// 等待地图加载完成
await page.evaluate(() => {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (window.BMap && window.map) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
});

// 设置缩放级别和城市中心
await page.evaluate((lng, lat, zoomLevel) => {
  const centerPoint = new window.BMap.Point(lng, lat);
  window.map.centerAndZoom(centerPoint, zoomLevel);
  console.log('map.centerAndZoom', lng, lat, zoomLevel);
}, cityCenter.lng, cityCenter.lat, zoomLevel);

await waitForTimeout(5000); // 等待地图加载完毕

// 测试单次移动
await page.evaluate((lng, lat) => {
  const newCenter = new window.BMap.Point(lng, lat);
  console.log(`Moving to new center 01: ${lng}, ${lat}`);
  window.map.panTo(newCenter);
}, cityCenter.lng + 0.01, cityCenter.lat + 0.01);

await waitForTimeout(5000); // 等待地图移动完成
// 截图
await page.screenshot({ path: `${basePath}_single_move_0.01.png` });
console.log('Captured single move screenshot');

// 测试单次移动
await page.evaluate((lng, lat) => {
  const newCenter = new window.BMap.Point(lng, lat);
  console.log(`Moving to new center 02: ${lng}, ${lat}`);
  window.map.panTo(newCenter);
}, cityCenter.lng + 0.02, cityCenter.lat + 0.01);

await waitForTimeout(5000); // 等待地图移动完成
// 截图
await page.screenshot({ path: `${basePath}_single_move_0.02.png` });
console.log('Captured single move screenshot');

// 结束浏览器会话
await browser.close();
