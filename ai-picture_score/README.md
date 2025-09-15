# 照片美学评分系统

[照片美学评分系统](https://huggingface.co/spaces/inksnow/picture_score)

[文章](https://inksnowhl.cn/inksnow-blog/blogs/AI/image/zhaopianpingfen.html)

[模型](https://huggingface.co/spaces/inksnow/picture_score/blob/main/model/picture_score_fp16.onnx)

## 项目介绍

本项目是一个基于 Node.js 和 ONNX Runtime 的图像处理工具集，包含以下功能：

1. 照片美学评分：评估图像的视觉、构图和质量等方面的美学分数
2. 图像分类：识别图像中的物体类别
3. 图像相似度计算：计算两张图像之间的相似度

## 环境要求

- Node.js (推荐 v14.x 或更高版本)
- npm 或 yarn

## 安装依赖

```bash
npm install
```

## 功能说明与使用方法

### 1. Web 演示

项目提供了一个基于浏览器的图形界面，可以直接在网页中上传图片并查看评分结果。

启动本地服务器后访问 `index.html` 文件即可使用：

```bash
# 安装 http-server（如果尚未安装）
npm install -g http-server

# 在项目根目录启动服务器
http-server

# 然后在浏览器中访问 http://localhost:8080
```

**Web 界面功能特点：**
- 拖拽或点击上传图片
- 实时显示图片预览
- 使用 ONNX Runtime Web 进行浏览器端推理
- 直观展示视觉、构图和质量三个维度的评分
- 无需上传图片到服务器，所有处理都在浏览器本地完成

### 2. 照片美学评分

评估图像在视觉、构图和质量方面的美学分数。

```bash
# 使用 sharp 库处理图像（推荐）
node ./scripts/picture_score_sharp.js <图像路径>

# 使用 jpeg-js 库处理图像
node ./scripts/picture_score_jpegjs.js <图像路径>
```

**输出示例：**
```
图像美学评分:
视觉评分: 75
构图评分: 68
质量评分: 82
综合评分: 74
```

**评分说明：**
- 各项评分范围为 1-100 分
- 综合评分采用加权平均计算：
  - 质量评分权重: 40%
  - 构图评分权重: 35%
  - 视觉评分权重: 25%

### 3. 图像分类

使用 MobileNetV2 模型识别图像中的物体类别。

```bash
node ./scripts/image_classifier.js <图像路径>
```

**输出示例：**
```
图像分类结果 (前5个):
1. red_fox: 78.17%
2. grey_fox: 8.63%
3. dhole: 5.84%
4. coyote: 3.05%
5. red_wolf: 1.71%
```

**模型信息：**
- 模型: MobileNetV2 (float16格式)
- 数据集: ImageNet (1000个类别)
- 输入尺寸: 224x224

### 4. 图像相似度计算

计算两张图像之间的相似度，支持余弦相似度和欧氏距离两种计算方式。

```bash
node ./scripts/image_similarity.js <图像路径1> <图像路径2>
```

**输出示例：**
```
图像相似度计算结果:
余弦相似度: 0.9234
欧氏距离: 28.4567

说明:
- 余弦相似度范围为 [-1, 1]，值越接近 1 表示图像越相似
- 欧氏距离值越小表示图像越相似
```

**相似度判断标准：**

1. 余弦相似度 (Cosine Similarity)
   - 高度相似: 0.8 - 1.0
   - 中度相似: 0.6 - 0.8
   - 轻度相似: 0.4 - 0.6
   - 基本不相似: 0.0 - 0.4

2. 欧氏距离 (Euclidean Distance)
   - 高度相似: 0 - 30
   - 中度相似: 30 - 60
   - 轻度相似: 60 - 100
   - 基本不相似: 100+

## 模型文件

项目使用以下 ONNX 格式的模型文件：

1. `./models/picture_score_fp16.onnx` - 照片美学评分模型
2. `./models/mobilenetv2-10_fp16.onnx` - 图像分类模型

## 技术特点

- 使用 ONNX Runtime 进行模型推理，支持跨平台运行
- 采用 float16 格式模型，减小模型体积并提高推理速度
- 使用 Sharp 库进行图像处理，支持多种图像格式
- 不依赖 TensorFlow.js，减少项目依赖和体积
- 支持 JPEG 和 PNG 等常见图像格式
- 提供 Web 端实现，支持浏览器本地推理

## 项目结构

```
.
├── scripts/                 # 功能脚本目录
│   ├── picture_score_sharp.js     # 基于 Sharp 的美学评分脚本
│   ├── picture_score_jpegjs.js    # 基于 jpeg-js 的美学评分脚本
│   ├── image_classifier.js        # 图像分类脚本
│   └── image_similarity.js        # 图像相似度计算脚本
├── models/                  # ONNX 模型文件目录
├── images/                  # 测试图像目录
├── index.html               # Web 演示页面
└── README.md                # 项目说明文档
```
