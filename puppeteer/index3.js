import puppeteer from 'puppeteer';

const pageUrl = 'https://map.baidu.com/';
const cityCenter = { lng: 12959566.112132119, lat: 4830530.681981771 };  // 北京天安门的 BD09 坐标
const radius = 30 * 1000;  // 30公里，单位为米
const zoomLevel = 16;      // 缩放级别（适当降低缩放级别）

const timeNow = new Date().getTime();
const basePath = `index3/${timeNow}`;

// 使用 setTimeout 来模拟等待
const waitForTimeout = async (timeout = 1000) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const browser = await puppeteer.launch();
const page = await browser.newPage();

// 打印浏览器控制台日志到 Node.js 控制台
page.on('console', msg => console.log('PAGE LOG:', msg.text()));

// 设置视口大小
await page.setViewport({ width: 1920, height: 1024 });

// 录制视频
const recorder = await page.screencast({ path: `${basePath}_recording.webm` });

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
  return new Promise(resolve => {
    const centerPoint = new window.BMap.Point(lng, lat);
    window.map.centerAndZoom(centerPoint, zoomLevel);
    console.log('map.centerAndZoom', lng, lat, zoomLevel);
    setTimeout(() => {
      resolve();
    }, 3000);  // 增加等待时间以确保地图加载完毕
  });
}, cityCenter.lng, cityCenter.lat, zoomLevel);

// 等待地图加载完成
await waitForTimeout(3000); // 适当等待时间，确保地图加载完毕

// 计算视口宽高
const viewport = await page.evaluate(() => {
  const mapDiv = document.querySelector('#maps'); // 确保选择正确的元素
  return {
    width: mapDiv.offsetWidth,
    height: mapDiv.offsetHeight
  };
});
console.log('viewport', viewport);

// 计算每像素对应的米数
const metersPerPixel = 156543.03392 * Math.cos(cityCenter.lat * Math.PI / 180) / Math.pow(2, zoomLevel); // 每像素对应的米数
console.log('metersPerPixel', metersPerPixel)
const stepX = viewport.width * metersPerPixel; // 每次平移的宽度（米）
const stepY = viewport.height * metersPerPixel; // 每次平移的高度（米）

// 计算步数
const stepsX = Math.ceil((2 * radius) / stepX);
const stepsY = Math.ceil((2 * radius) / stepY);

for (let i = 0; i < stepsY; i++) {
  if (i > 2) {
    break
  }
  await page.evaluate((i, stepY) => {
    return new Promise(resolve => {
      console.log(`Moving to Y: ${i} => ${stepY}`);
      window.map.panBy(1, stepY)
      setTimeout(() => {
        resolve();
      }, 1000);  // 增加等待时间以确保地图平移完毕
    })
  }, i, stepY);
  for (let j = 0; j < stepsX; j++) {
    if (j > 2) {
      break
    }

    // 移动地图
    await page.evaluate((i, j, stepX, stepY) => {
      return new Promise(resolve => {
        console.log(`Moving to X: ${j} => ${stepX}`);
        window.map.panBy(stepX, 1)
        setTimeout(() => {
          resolve();
        }, 1000);  // 增加等待时间以确保地图平移完毕
      });
    }, i, j, stepX, stepY);

    // 等待地图平移完成
    // await waitForTimeout(1000); // 适当等待时间，确保地图平移完成

    // 截图
    await page.screenshot({ path: `${basePath}_city_screenshot_${i}_${j}.png` });
    console.log(`Captured screenshot ${i}_${j}`);
  }
}

// 结束视频录制
await recorder.stop();

await browser.close();
