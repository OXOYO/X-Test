
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const basePath = 'index7'; // 修改为你的路径
const outputDir = `${basePath}/output`;
const outputFilePath = `${outputDir}/merged_image.png`;

// 创建输出目录
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 假设所有图片大小一致，读取第一张图片获取大小信息
const sampleImagePath = path.join(basePath, 'city_screenshot_0_0.png');
const sampleImage = sharp(sampleImagePath);
const { width, height } = await sampleImage.metadata();

const stepsX = 3; // 横向步数
const stepsY = 3; // 纵向步数

// 创建拼接后的空白大图
let largeImage = sharp({
  create: {
    width: width * stepsX,
    height: height * stepsY,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  }
});

// 拼接每张图片并标记序号
for (let i = 0; i < stepsY; i++) {
  for (let j = 0; j < stepsX; j++) {
    const imagePath = path.join(basePath, `city_screenshot_${i}_${j}.png`);
    const overlay = await sharp(imagePath)
      .composite([
        {
          input: Buffer.from(`<svg><text x="10" y="20" font-size="30" fill="red">${i},${j}</text></svg>`),
          top: 0,
          left: 0
        }
      ])
      .toBuffer();

    largeImage = largeImage.composite([{ input: overlay, top: i * height, left: j * width }]);
  }
}

// 输出拼接后的大图
await largeImage.toFile(outputFilePath);
console.log(`Merged image created at ${outputFilePath}`);
