/**
 * 测试获取图片大小库的性能
 *
 * */
const path = require('path');
const sharp = require('sharp');
const imageSize = require('image-size');

let fastImage = null
;(async () => {
  fastImage = await import('fastimage')
})()

const bySharp = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata();
    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return null;
  }
}

const byImageSize = (imagePath) => {
  try {
    const dimensions = imageSize(imagePath);
    return { width: dimensions.width, height: dimensions.height };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return null;
  }
}

const byFastImage = async (imagePath) => {
  try {
    const dimensions = await fastImage.info(imagePath);
    return { width: dimensions.width, height: dimensions.height };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return null;
  }
}

const funcMap = {
  'bySharp': bySharp,
  'byImageSize': byImageSize,
  'byFastImage': byFastImage
}

const imagePath = path.join(__dirname, './unsplash_fewH5hj9_O8.jpg');
const benchTimes = {}
const benchRes = {}

const run = async (images, funcs) => {
   for (let i = 0; i < funcs.length; i++) {
     const func = funcs[i];
     // 使用示例
     const timeStart = new Date().getTime()
     let res = []
     for (let i = 0; i < images.length; i++) {
       const dimensions = await funcMap[func](imagePath)
       if (dimensions) {
         res.push({ width: dimensions.width, height: dimensions.height })
         // console.log(`Width: ${dimensions.width}`);
         // console.log(`Height: ${dimensions.height}`);
       }
     }
     benchRes[func] = res[0]
     benchTimes[func].push(new Date().getTime() - timeStart)
   }
}

const runBench = async (benchLen = 100, imageLen = 100, funcs = ['bySharp', 'byImageSize', 'byFastImage']) => {
    const images = Array.from({length: imageLen}, (_, i) => imagePath);
    funcs.forEach(func => {
      benchTimes[func] = []
    })
    for (let i = 0; i < benchLen; i++) {
      await run(images, funcs)
    }
    funcs.forEach(func => {
      const avgBench = benchTimes[func].reduce((a, b) => a + b, 0) / benchLen
      const avg = avgBench / imageLen
      benchTimes[func].push(avgBench, avg)
    })

    console.log('benchLen:', benchLen, 'imageLen:', imageLen)
    console.table(benchTimes)
    console.table(benchRes)
    process.exit()
}
runBench(30, 50, ['bySharp', 'byImageSize', 'byFastImage'])
