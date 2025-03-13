import Crawler from 'crawler';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建一个保存图片的函数
async function downloadImage(url, filename) {
  const writer = fs.createWriteStream(filename);

  // 通过 axios 请求图片并将其保存到本地
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// 创建 Crawler 实例
const c = new Crawler({
  maxConnections: 10,
  callback: async (error, res, done) => {
    const $ = res.$;
    const images = [];

    // 获取页面上的所有图片 URL
    $('img').each((index, image) => {
      let imgUrl = $(image).attr('src');
      if (imgUrl) {
        // 如果是相对路径，转换为绝对路径
        if (!imgUrl.startsWith('http')) {
          imgUrl = new URL(imgUrl, res.request.uri.href).href;
        }

        images.push(imgUrl);
      }
    });

    // 下载每一张图片
    for (let i = 0; i < images.length; i++) {
      const imgUrl = images[i];
      const filename = path.join(__dirname, 'images', `image${i + 1}.jpg`);

      // 创建文件夹如果不存在
      if (!fs.existsSync(path.dirname(filename))) {
        fs.mkdirSync(path.dirname(filename), { recursive: true });
      }

      try {
        console.log(`正在下载图片: ${imgUrl}`);
        await downloadImage(imgUrl, filename);
        console.log(`图片保存成功: ${filename}`);
      } catch (error) {
        console.error(`下载图片失败: ${imgUrl}`, error);
      }
    }

    done();
  }
});

// 开始爬取网页
c.queue('https://www.bing.com');
