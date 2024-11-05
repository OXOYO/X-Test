import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import puppeteer from 'puppeteer';

const pageUrl = 'https://map.baidu.com/';
const cityCenter = { lng: 12959566.112132119, lat: 4830530.681981771 };  // 北京天安门的 BD09 坐标

const radius = 15 * 1000;  // 30公里，单位为米
const zoomLevel = 18;      // 缩放级别

const timeNow = new Date().getTime();
const basePath = `index7_${radius}_${zoomLevel}`;

// 创建输出目录
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

// 使用 setTimeout 来模拟等待
const waitForTimeout = async (timeout = 1000) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const browser = await puppeteer.launch();
const page = await browser.newPage();

// 打印浏览器控制台日志到 Node.js 控制台
page.on('console', msg => console.log('PAGE LOG:', msg.text()));

// 设置视口大小
await page.setViewport({ width: 4000, height: 2000 });

// 录制视频
// const recorder = await page.screencast({ path: `${basePath}/recording.webm` });

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

// 隐藏消息面板
await page.evaluate(() => {
  const el = document.querySelector('#message-panel'); // 确保选择正确的元素
  el.style.display = 'none';
});


// // 设置缩放级别和城市中心
await page.evaluate((lng, lat, zoomLevel) => {
  const centerPoint = new window.BMap.Point(lng, lat);
  window.map.centerAndZoom(centerPoint, zoomLevel);
  console.log('map.centerAndZoom', lng, lat, zoomLevel);
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

// 计算每像素对应的地理距离
const pxMeter = await page.evaluate(() => {
  const scaleTextEl = document.querySelector('.BMap_scaleTxt')
  const width = scaleTextEl.offsetWidth
  const [scale, unit] = scaleTextEl.innerHTML.split('&nbsp;')
  console.log('scale', scale, 'unit', unit)
  const units = {
    '米': 1,
    '公里': 1000
  }
  const scaleMeter = Number(scale) * units[unit]
  // 1像素对应的距离，单位：米
  const pxMeter = scaleMeter / width
  console.log('pxMeter', pxMeter)
  return pxMeter
});

// 计算步长
const stepX = viewport.width * pxMeter; // 每次平移的宽度（米）
const stepY = viewport.height * pxMeter; // 每次平移的高度（米）
console.log('stepX', stepX, 'stepY', stepY)
// 计算步数
const stepsX = Math.ceil(radius * 2 / stepX)
const stepsY = Math.ceil(radius * 2 / stepY)
console.log('stepsX', stepsX, 'stepsY', stepsY)

console.log('cityCenter', cityCenter.lng, cityCenter.lat)
// 计算最西北角的初始坐标
const initialLng = cityCenter.lng - radius;
const initialLat = cityCenter.lat + radius;

await page.evaluate((lng, lat) => {
  const point = new window.BMap.Point(lng, lat);
  window.map.setCenter(point);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);  // 增加等待时间以确保地图平移完毕
  });
}, initialLng, initialLat);



for (let i = 0; i < stepsY; i++) {
  for (let j = 0; j < stepsX; j++) {
    // 如果不是第一列，则向右移动
    if (j > 0) {
      await page.evaluate((x) => {
        return new Promise(resolve => {
          // 向右平移
          window.map.panBy(-x, 0);
          setTimeout(() => {
            resolve();
          }, 3000);  // 增加等待时间以确保地图平移完毕
        });
      }, viewport.width);
    }

    // 截图
    await page.screenshot({ path: `${basePath}/city_screenshot_${i}_${j}.png` });
    console.log(`Captured screenshot ${i}_${j}`);

    if (j === stepsX - 1) {
      // 如果是最后一列，则向下移动
      await page.evaluate((x, y) => {
        return new Promise(resolve => {
          // 向下平移，并恢复初始位置

          window.map.panBy(x, -y);
          setTimeout(() => {
            resolve();
          }, 3000);  // 增加等待时间以确保地图平移完毕
        });
      }, viewport.width * (stepsX - 1), viewport.height);
    }
  }
}


// 结束视频录制
// await recorder.stop();

await browser.close();

/************** 开始拼接图片 **************/
// 假设所有图片大小一致，读取第一张图片获取大小信息
const sampleImagePath = path.join(basePath, 'city_screenshot_0_0.png');
const sampleImage = sharp(sampleImagePath);
const { width, height } = await sampleImage.metadata();
console.log(`Sample image dimensions: width=${width}, height=${height}`);


// 创建拼接后的空白大图
let largeImage = sharp({
  create: {
    width: width * stepsX,
    height: height * stepsY,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  },
  limitInputPixels: false,
  unlimited: false,
}).tiff({
    compression: "deflate",
});

// 并行化拼接图片
const composites = [];
for (let i = 0; i < stepsY; i++) {
  for (let j = 0; j < stepsX; j++) {
    const imagePath = path.join(basePath, `city_screenshot_${i}_${j}.png`);
    if (fs.existsSync(imagePath)) {
      const overlay = sharp(imagePath)
        .composite([
          {
            input: Buffer.from(`<svg width="200px" height="100px">
          <rect width="100%" height="100%" fill="white"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="50" fill="red" font-weight="bold">
            ${i}_${j}
          </text>
        </svg>`),
            top: 100,
            left: 100
          }
        ])
        .toBuffer();

      composites.push(
        overlay.then(buffer => ({ input: buffer, top: i * height, left: j * width }))
      );
    } else {
      console.error(`Image ${i}_${j} not found at path: ${imagePath}`);
    }
  }
}

// 等待所有图片合并操作完成
const compositeResults = await Promise.all(composites);

// 执行拼接
largeImage = largeImage.composite(compositeResults);

const outputFilePath = `${basePath}/merged_image.tiff`;
// 输出拼接后的大图
await largeImage.toFile(outputFilePath);
console.log(`Merged image created at ${outputFilePath}`);
