const ort = require('onnxruntime-node');
const fs = require('fs');
const sharp = require('sharp');

class ImageSimilarity {
  constructor() {
    // 固定模型路径
    this.modelPath = './models/mobilenetv2-10_fp16.onnx';
    this.model = null;
  }

  async loadModel() {
    if (!this.model) {
      console.log('正在加载模型...');
      this.model = await ort.InferenceSession.create(this.modelPath);
      console.log('模型加载成功');
    }
  }

  _float16ToFloat32(binary) {
    if (binary === 0) return 0;

    const sign = (binary & 0x8000) !== 0 ? -1 : 1;
    let exponent = (binary & 0x7c00) >> 10;
    const fraction = binary & 0x03ff;

    if (exponent === 0) {
      return sign * Math.pow(2, -14) * (fraction / 0x400);
    } else if (exponent === 31) {
      return fraction ? NaN : sign * Infinity;
    }

    exponent = exponent - 15;
    return sign * Math.pow(2, exponent) * (1 + fraction / 0x400);
  }

  _float32ToFloat16(float32) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, float32);

    const bits = view.getUint32(0);
    const sign = (bits >> 31) & 0x1;
    let exponent = (bits >> 23) & 0xff;
    let fraction = bits & 0x7fffff;

    // 调整指数
    exponent = exponent - 127 + 15;

    // 处理特殊情况
    if (exponent <= 0) {
      // 下溢出，转为0
      return (sign << 15) | 0;
    } else if (exponent > 31) {
      // 上溢出，转为无穷大
      return (sign << 15) | 0x7c00;
    }

    // 正常情况
    exponent = exponent << 10;
    fraction = fraction >> 13;

    return (sign << 15) | exponent | fraction;
  }

  async preprocessImage(imagePath, inputShape) {
    try {
      // 使用 sharp 读取和处理图像
      const image = sharp(imagePath);

      // 根据模型要求调整图像大小
      const shape = Array.from(inputShape);
      const [batchSize, channels, height, width] = shape;
      const resizedImage = await image
        .resize(width, height)
        .removeAlpha()
        .raw()
        .toBuffer();

      // 将图像数据转换为float32数组并归一化
      const float32Data = new Float32Array(width * height * channels);
      for (let i = 0; i < resizedImage.length; i++) {
        float32Data[i] = resizedImage[i] / 255.0;
      }

      // 重塑为模型所需的格式 [batch, channels, height, width]
      const reshapedData = new Float32Array(batchSize * channels * height * width);
      let index = 0;
      for (let b = 0; b < batchSize; b++) {
        for (let c = 0; c < channels; c++) {
          for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
              reshapedData[index++] = float32Data[h * width * channels + w * channels + c];
            }
          }
        }
      }

      // 转换为float16
      const float16Data = new Uint16Array(reshapedData.length);
      for (let i = 0; i < reshapedData.length; i++) {
        float16Data[i] = this._float32ToFloat16(reshapedData[i]);
      }

      // 创建张量
      const tensor = new ort.Tensor('float16', float16Data, shape);
      return tensor;
    } catch (error) {
      console.error('图像预处理失败:', error);
      throw error;
    }
  }

  async extractFeatures(imagePath) {
    if (!this.model) {
      await this.loadModel();
    }

    try {
      // 使用默认的输入名称和形状
      const inputName = 'input';
      // 默认输入形状 [batch, channels, height, width]
      const inputShape = [1, 3, 224, 224];

      // 预处理图像
      const tensor = await this.preprocessImage(imagePath, inputShape);

      // 运行推理
      const feeds = { [inputName]: tensor };
      const results = await this.model.run(feeds);

      // 获取输出
      const outputNames = Object.keys(this.model.outputNames);

      // 尝试不同的方式获取输出数据
      let outputData;
      const outputName = outputNames[0] || 'output';

      if (results[outputName]) {
        outputData = results[outputName].data;
      } else {
        // 尝试使用 'output' 作为名称
        outputData = results['output'] ? results['output'].data : null;
      }

      if (!outputData) {
        throw new Error('无法获取模型输出数据');
      }

      // 将float16输出转换为float32
      const output = Array.from(outputData).map(val => this._float16ToFloat32(val));

      return output;
    } catch (error) {
      console.error('特征提取失败:', error);
      throw error;
    }
  }

  // 计算余弦相似度
  cosineSimilarity(features1, features2) {
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < features1.length; i++) {
      dotProduct += features1[i] * features2[i];
      magnitude1 += features1[i] * features1[i];
      magnitude2 += features2[i] * features2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
  }

  // 计算欧氏距离
  euclideanDistance(features1, features2) {
    let sum = 0;

    for (let i = 0; i < features1.length; i++) {
      const diff = features1[i] - features2[i];
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  }

  async calculateSimilarity(imagePath1, imagePath2) {
    try {
      console.log('正在提取第一张图像的特征...');
      const features1 = await this.extractFeatures(imagePath1);

      console.log('正在提取第二张图像的特征...');
      const features2 = await this.extractFeatures(imagePath2);

      console.log('正在计算相似度...');
      const cosineSim = this.cosineSimilarity(features1, features2);
      const euclideanDist = this.euclideanDistance(features1, features2);

      return {
        cosineSimilarity: cosineSim,
        euclideanDistance: euclideanDist
      };
    } catch (error) {
      console.error('计算相似度失败:', error);
      throw error;
    }
  }
}

async function main() {
  if (process.argv.length < 4) {
    console.log('用法: node image_similarity.js <图像路径1> <图像路径2>');
    process.exit(1);
  }

  const imagePath1 = process.argv[2];
  const imagePath2 = process.argv[3];

  if (!fs.existsSync(imagePath1)) {
    console.error('第一个图像文件未找到:', imagePath1);
    process.exit(1);
  }

  if (!fs.existsSync(imagePath2)) {
    console.error('第二个图像文件未找到:', imagePath2);
    process.exit(1);
  }

  try {
    const similarity = new ImageSimilarity();
    const results = await similarity.calculateSimilarity(imagePath1, imagePath2);

    console.log('\n图像相似度计算结果:');
    console.log(`余弦相似度: ${results.cosineSimilarity.toFixed(4)}`);
    console.log(`欧氏距离: ${results.euclideanDistance.toFixed(4)}`);
    console.log('\n说明:');
    console.log('- 余弦相似度范围为 [-1, 1]，值越接近 1 表示图像越相似');
    console.log('- 欧氏距离值越小表示图像越相似');
  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

// 如果直接执行此文件则运行main函数
if (require.main === module) {
  main();
}

module.exports = ImageSimilarity;
