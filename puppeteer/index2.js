import puppeteer from 'puppeteer';

const pageUrl = 'https://map.baidu.com/';
const cityCenter = { lat: 39.9042, lng: 116.4074 };  // 以北京天安门为例
const radius = 30 * 1000;  // 30公里，单位为米
const zoomLevel = 18;      // 缩放级别

const timeNow = new Date().getTime()

// 使用 setTimeout 来模拟等待
const waitForTimeout = async (timeout = 1000) => {
  return await new Promise(resolve => setTimeout(resolve, 1000));  // 等待1秒
}

const browser = await puppeteer.launch();
const page = await browser.newPage();

// 打印浏览器控制台日志到 Node.js 控制台
page.on('console', msg => console.log('PAGE LOG:', msg.text()));

// 设置视口大小
const viewportSize = 1024 * 2; // 设置适合的视口大小
await page.setViewport({ width: viewportSize, height: viewportSize });

await page.goto(pageUrl, { waitUntil: 'networkidle2' });

// 等待地图加载并获取地图实例
const map = await page.evaluateHandle(() => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.BMap && window.map) {
        clearInterval(interval);
        console.log('window.map')
        resolve(window.map);
      }
    }, 100);
  });
});
console.log('map', map)

// 设置缩放级别和城市中心
await page.evaluate((map, lat, lng, zoomLevel) => {
  const centerPoint = new BMap.Point(lng, lat);
  map.centerAndZoom(centerPoint, zoomLevel);
  console.log('map.centerAndZoom')
}, map, cityCenter.lat, cityCenter.lng, zoomLevel);

// 等待地图加载完成
await waitForTimeout(3000); // 适当等待时间，确保地图加载完毕

// 计算视口宽高
const viewport = await page.evaluate(() => {
  return {
    width: document.querySelector('#maps').offsetWidth,
    height: document.querySelector('#maps').offsetHeight
  };
});
console.log('viewport', viewport)

// 计算每像素对应的米数
const metersPerPixel = 156543.03392 * Math.cos(cityCenter.lat * Math.PI / 180) / Math.pow(2, zoomLevel); // 每像素对应的米数
const stepX = viewport.width * metersPerPixel; // 每次平移的宽度（米）
const stepY = viewport.height * metersPerPixel; // 每次平移的高度（米）

const stepsX = Math.ceil((2 * radius) / stepX);
const stepsY = Math.ceil((2 * radius) / stepY);

for (let i = 0; i < stepsY; i++) {
  for (let j = 0; j < stepsX; j++) {
    // 计算当前视口的中心点
    const offsetX = (j - stepsX / 2) * stepX;
    const offsetY = (i - stepsY / 2) * stepY;
    const centerLat = cityCenter.lat + (offsetY / 111320);
    const centerLng = cityCenter.lng + (offsetX / (111320 * Math.cos(cityCenter.lat * Math.PI / 180)));

    // 移动地图
    await page.evaluate((map, lat, lng) => {
      const newCenter = new BMap.Point(lng, lat);
      console.log(`newCenter: ${lng}, ${lat}`)
      map.panTo(newCenter);
    }, map, centerLat, centerLng);

    // 等待地图平移完成
    await waitForTimeout(1000); // 适当等待时间，确保地图平移完成

    // 截图
    await page.screenshot({ path: `index2/${timeNow}_city_screenshot_${i}_${j}.png` });
    console.log(`Captured screenshot ${i}_${j}`);
  }
}

await browser.close();
