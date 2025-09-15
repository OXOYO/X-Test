// image-scorer.js
const ort = require('onnxruntime-node');
const fs = require('fs');
const jpeg = require('jpeg-js');

class ImageScorer {
  constructor(modelPath) {
    this.modelPath = modelPath;
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

  // 添加float32到float16的正确转换函数
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

  async _preprocessImage(imagePath) {
    try {
      // 读取图像文件
      const imageData = fs.readFileSync(imagePath);

      // 解码JPEG图像
      const img = jpeg.decode(imageData, { useTArray: true });

      let rgbData;
      // 检查是否有alpha通道（每个像素4个字节）
      if (img.data.length === img.width * img.height * 4) {
        // 提取RGB通道，忽略alpha通道
        rgbData = new Uint8Array(img.width * img.height * 3);
        for (let i = 0, j = 0; i < img.data.length; i += 4, j += 3) {
          rgbData[j] = img.data[i];     // R
          rgbData[j + 1] = img.data[i + 1]; // G
          rgbData[j + 2] = img.data[i + 2]; // B
        }
      } else {
        // 如果已经是RGB格式，直接使用
        rgbData = img.data;
      }

      // 调整大小为224x224（双线性插值）
      const resized = this._resizeImage(rgbData, img.width, img.height, 224, 224);

      // 归一化到[0,1]并转换为CHW格式
      const normalized = this._normalizeAndTranspose(resized);

      // 转换为float16
      const float16Data = new Uint16Array(normalized.length);
      for (let i = 0; i < normalized.length; i++) {
        // 使用正确的float32到float16转换
        float16Data[i] = this._float32ToFloat16(normalized[i]);
      }

      return new ort.Tensor('float16', float16Data, [1, 3, 224, 224]);
    } catch (error) {
      console.error('图像预处理失败:', error);
      throw error;
    }
  }

  // 双线性插值调整图像大小
  _resizeImage(data, srcWidth, srcHeight, dstWidth, dstHeight) {
    const dstData = new Float32Array(dstWidth * dstHeight * 3);
    const xRatio = srcWidth / dstWidth;
    const yRatio = srcHeight / dstHeight;

    for (let y = 0; y < dstHeight; y++) {
      for (let x = 0; x < dstWidth; x++) {
        const srcX = x * xRatio;
        const srcY = y * yRatio;
        const x1 = Math.floor(srcX);
        const y1 = Math.floor(srcY);
        const x2 = Math.min(x1 + 1, srcWidth - 1);
        const y2 = Math.min(y1 + 1, srcHeight - 1);

        const dx = srcX - x1;
        const dy = srcY - y1;

        for (let c = 0; c < 3; c++) {
          const idx11 = (y1 * srcWidth + x1) * 3 + c;
          const idx12 = (y2 * srcWidth + x1) * 3 + c;
          const idx21 = (y1 * srcWidth + x2) * 3 + c;
          const idx22 = (y2 * srcWidth + x2) * 3 + c;

          const val1 = data[idx11] * (1 - dx) + data[idx21] * dx;
          const val2 = data[idx12] * (1 - dx) + data[idx22] * dx;
          const val = val1 * (1 - dy) + val2 * dy;

          const dstIdx = (y * dstWidth + x) * 3 + c;
          dstData[dstIdx] = val;
        }
      }
    }

    return dstData;
  }

  // 归一化并转置为CHW格式
  _normalizeAndTranspose(data) {
    const normalized = new Float32Array(224 * 224 * 3);

    // 转换为float并归一化，同时转置为CHW格式
    for (let c = 0; c < 3; c++) {
      for (let h = 0; h < 224; h++) {
        for (let w = 0; w < 224; w++) {
          const srcIdx = (h * 224 + w) * 3 + c;
          const dstIdx = c * 224 * 224 + h * 224 + w;
          normalized[dstIdx] = data[srcIdx] / 255.0;
        }
      }
    }

    return normalized;
  }

  // 添加计算综合评分的方法
  _calculateOverallScore(visual, composition, quality) {
    // 使用加权平均计算综合评分
    // 这里给质量更高权重，因为质量差的图片整体体验会很差
    const weights = {
      visual: 0.25,
      composition: 0.35,
      quality: 0.40
    };

    const overall = visual * weights.visual +
                   composition * weights.composition +
                   quality * weights.quality;

    return Math.round(overall);
  }

  async predict(imagePath) {
    if (!this.model) {
      await this.loadModel();
    }

    try {
      const tensor = await this._preprocessImage(imagePath);
      const feeds = { input: tensor };
      const results = await this.model.run(feeds);

      const output = results.output.data;
      console.log('模型原始输出:', Array.from(output));

      // 将float16转换为float32
      const decodedValues = Array.from(output).map(val =>
        this._float16ToFloat32(val)
      );

      console.log('解码值:', decodedValues);

      // 应用校正（基于Web版本的校准）
      const correctedValues = decodedValues.map((val, index) => {
        // 应用通用缩放校正
        return val * 0.95;
      });

      // 计算最终分数（1-100分制）
      const scores = correctedValues.map(val =>
        Math.round(Math.max(0, Math.min(1, val)) * 1.1 * 99 + 1)
      );

      // 计算综合评分
      const overallScore = this._calculateOverallScore(
        scores[0],
        scores[1],
        scores[2]
      );

      return {
        visual: scores[0],
        composition: scores[1],
        quality: scores[2],
        overall: overallScore
      };
    } catch (error) {
      console.error('预测失败:', error);
      throw error;
    }
  }
}

async function main() {
  if (process.argv.length < 3) {
    console.log('用法: node image-scorer.js <图像路径>');
    process.exit(1);
  }

  const imagePath = process.argv[2];
  const modelPath = './models/picture_score_fp16.onnx'; // 确保此文件存在

  if (!fs.existsSync(imagePath)) {
    console.error('图像文件未找到:', imagePath);
    process.exit(1);
  }

  if (!fs.existsSync(modelPath)) {
    console.error('模型文件未找到:', modelPath);
    process.exit(1);
  }

  try {
    const scorer = new ImageScorer(modelPath);
    const scores = await scorer.predict(imagePath);

    console.log('\n图像美学评分:');
    console.log('视觉评分:', scores.visual);
    console.log('构图评分:', scores.composition);
    console.log('质量评分:', scores.quality);
    console.log('综合评分:', scores.overall);
  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

// 如果直接执行此文件则运行main函数
if (require.main === module) {
  main();
}

module.exports = ImageScorer;
