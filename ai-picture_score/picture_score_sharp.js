// image-scorer.js
const ort = require('onnxruntime-node');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const sharp = require('sharp');

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

  async _preprocessImage(imagePath) {
    try {
      // 使用 sharp 读取和处理图像
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      
      // 调整大小为224x224并转换为RGB格式
      const resizedImage = await image
        .resize(224, 224)
        .ensureAlpha(false)
        .raw()
        .toBuffer();
      
      // 创建张量
      const tensor = tf.tensor3d(resizedImage, [224, 224, 3], 'int32');
      
      // 归一化到[0,1]
      const normalized = tensor.div(255.0);
      
      // 转换为CHW格式
      const transposed = normalized.transpose([2, 0, 1]).expandDims(0);
      
      // 转换为float16
      const float32Data = await transposed.data();
      const float16Data = new Uint16Array(float32Data.length);
      
      for (let i = 0; i < float32Data.length; i++) {
        // 简单的float32到float16转换
        const val = float32Data[i];
        const f32 = new Float32Array([val]);
        const u16 = new Uint16Array(f32.buffer);
        float16Data[i] = u16[0];
      }
      
      // 清理张量
      tensor.dispose();
      normalized.dispose();
      transposed.dispose();
      
      return new ort.Tensor('float16', float16Data, [1, 3, 224, 224]);
    } catch (error) {
      console.error('图像预处理失败:', error);
      throw error;
    }
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
      
      return {
        visual: scores[0],
        composition: scores[1],
        quality: scores[2]
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
  const modelPath = 'picture_score_fp16.onnx'; // 确保此文件存在
  
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