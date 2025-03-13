import Crawler from "crawler";
import fs from 'fs';
import path from 'path';
import { URL, fileURLToPath } from 'url';

// 获取当前模块的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建下载目录
const downloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

// 初始化Crawler
const c = new Crawler({
  maxConnections: 10, // 并发数
  retries: 3, // 重试次数
  retryInterval: 2000, // 重试间隔时间（毫秒）
  rateLimit: 2000, // 每次请求的最小间隔（2000 毫秒即 2 秒）
  headers: {
    // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36', // 模拟常见浏览器的 User-Agent
    // 'Referer': 'https://www.pexels.com/zh-cn/' // 设置 Referer，模拟来自该页面的请求
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36', // 模拟常见浏览器的 User-Agent
    'Referer': 'https://www.pexels.com/zh-cn/', // 设置 Referer，模拟来自该页面的请求
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8', // Accept 头部，模拟浏览器支持的格式
    'Accept-Language': 'en-US,en;q=0.9', // 模拟语言首选项
    'Connection': 'keep-alive', // 保持连接
    'Upgrade-Insecure-Requests': '1', // 启用不安全请求升级
  },
  callback: (error, res, done) => {
    if (error) {
      console.error(`Error fetching ${res.options.uri}:`, error.message);
    } else {
      const $ = res.$; // 使用cheerio解析HTML
      const baseUrl = res.options.uri; // 使用res.options.uri替代res.request.uri.href

      // 提取所有图片
      $('img').each((i, element) => {
        const imgSrc = $(element).attr('src') || $(element).attr('data-src'); // 处理懒加载
        if (imgSrc) {
          const imgUrl = new URL(imgSrc, baseUrl).href; // 转换为绝对URL

          console.log(`Found image: ${imgUrl}`); // 打印出找到的图片URL
          downloadImage(imgUrl); // 下载图片
        } else {
          console.log(`No image source found for element:`, element);
        }
      });
    }
    done();
  }
});

// 下载图片函数
function downloadImage(imgUrl) {
  const filename = path.basename(imgUrl).split('?')[0]; // 去除查询参数
  const filePath = path.join(downloadDir, filename);

  console.log(`Downloading image: ${imgUrl} to ${filePath}`); // 打印正在下载的图片URL

  c.queue({
    uri: imgUrl,
    encoding: null, // 以二进制流形式获取数据
    callback: (error, res, done) => {
      if (error) {
        console.error(`Failed to download ${imgUrl}:`, error.message);
      } else {
        fs.writeFileSync(filePath, res.body); // 保存图片
        console.log(`Downloaded: ${filename}`);
      }
      done();
    }
  });
}

// 开始爬取
const targetUrl = 'https://www.pexels.com/zh-cn/'; // 替换为目标网站
console.log(`Starting crawl for: ${targetUrl}`);
c.queue(targetUrl);
