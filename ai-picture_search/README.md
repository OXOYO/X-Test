# AI 图像语义搜索系统

基于 MobileCLIP 系列模型的图像语义搜索系统，可以根据文本描述在图像库中搜索最相关的图片。同时支持图像描述生成功能。

## 功能特点

- 基于语义的图像搜索，而非简单的关键词匹配
- 支持 MobileCLIP 系列模型
- 自动缓存图片特征以提高搜索效率
- 以表格形式展示搜索结果
- 支持图像描述自动生成

## 环境要求

- Python 3.12 (使用 conda 环境)
- PyTorch >= 2.8.0
- 其他依赖项见 `requirements.txt`

## 安装步骤

1. 克隆项目:
   ```bash
   git clone <项目地址>
   cd ai-picture_search
   ```

2. 创建并激活 conda 环境:
   ```bash
   conda create -n python3.12 python=3.12
   conda activate python3.12
   ```

3. 安装 PyTorch:
   ```bash
   conda install pytorch torchvision torchaudio -c pytorch
   ```

4. 安装 MobileCLIP:
   ```bash
   pip install git+https://github.com/apple/ml-mobileclip.git
   ```

5. 安装其他依赖:
   ```bash
   pip install scikit-learn
   ```

## MobileCLIP2 模型特殊配置说明

MobileCLIP2 模型需要特殊的 OpenCLIP 配置才能正常工作。如果你需要使用 MobileCLIP2 模型，请按照以下步骤操作：

1. 克隆 OpenCLIP 仓库并应用 MobileCLIP2 补丁:
   ```bash
   git clone https://github.com/mlfoundations/open_clip.git
   cd open_clip
   git apply ../ml-mobileclip/mobileclip2/open_clip_inference_only.patch
   cp -r ../ml-mobileclip/mobileclip2/* ./src/open_clip/
   pip install -e .
   ```

2. 安装额外依赖:
   ```bash
   pip install git+https://github.com/huggingface/pytorch-image-models
   ```

完成以上步骤后，MobileCLIP2 模型应该可以正常使用。

## CoCa 模型（图像描述生成）

图像描述生成功能使用 CoCa (Contrastive Captioner) 模型，可以为图片自动生成自然语言描述。

### 支持的模型

- `coca_ViT-L-14` (默认，推荐)
- `coca_ViT-B-32`

### 使用方式

1. **自动下载预训练模型**（推荐）：
   首次运行时会自动从网络下载预训练模型，需要保持网络连接。

2. **手动下载模型**：
   如果需要使用本地模型文件，可以从以下地址下载：
   - [CoCa ViT-L-14](https://huggingface.co/laion/CoCa-ViT-L-14-laion2B-s13B-b90k)
   - [CoCa ViT-B-32](https://huggingface.co/laion/CoCa-ViT-B-32-laion2B-s13B-b90k)
   
   下载后将模型文件放置在 `models/` 目录中，并重命名为对应的名称（如 `coca_ViT-L-14.pt`）。

### 网络问题解决方案

在下载预训练模型时可能会遇到网络问题，如 403 Forbidden 错误。可以尝试以下解决方案：

1. **检查网络连接**：
   确保网络连接稳定，可以访问 Hugging Face。

2. **使用代理或 VPN**：
   如果直接连接存在问题，可以尝试使用代理或 VPN。

3. **手动下载模型**：
   - 访问 [Hugging Face CoCa 模型页面](https://huggingface.co/laion)
   - 下载所需的模型文件
   - 将文件放置在 `models/` 目录中

4. **重试下载**：
   网络临时问题可能导致下载失败，稍后重试可能成功。

## 项目结构

```
ai-picture_search/
├── images/                  # 图片库目录
├── models/                  # 模型文件目录
├── .cache/                  # 特征缓存目录
├── py/                      # Python 脚本目录
│   ├── search_mobileclip.py   # MobileCLIP 搜索脚本
│   ├── search_mobileclip2.py  # MobileCLIP2 搜索脚本（需要特殊配置）
│   ├── compare_mobileclip.py  # MobileCLIP 模型比较脚本
│   ├── compare_mobileclip2.py # MobileCLIP2 模型比较脚本
│   ├── test_mobileclip2.py    # MobileCLIP2 模型测试脚本
│   ├── generate_caption.py    # 图像描述生成脚本
│   └── test.py                # 简单测试脚本
├── ml-mobileclip/           # MobileCLIP 官方实现
├── README.md
└── requirements.txt
```

## 脚本说明

### py/search_mobileclip.py

用于使用 MobileCLIP 系列模型进行图像搜索。

使用方法:
```bash
python py/search_mobileclip.py "查询文本" [模型名称]
```

示例:
```bash
# 使用默认模型 mobileclip_s0
python py/search_mobileclip.py "一只狗"

# 指定模型名称
python py/search_mobileclip.py "一只狗" mobileclip_s1
```

支持的模型:
- mobileclip_s0
- mobileclip_s1
- mobileclip_s2

### py/search_mobileclip2.py

用于使用 MobileCLIP2 系列模型进行图像搜索。

使用方法:
```bash
python py/search_mobileclip2.py "查询文本" [模型名称]
```

示例:
```bash
# 使用默认模型 mobileclip2_s0
python py/search_mobileclip2.py "一只狗"

# 指定模型名称
python py/search_mobileclip2.py "一只狗" mobileclip2_s2
```

支持的模型:
- mobileclip2_s0
- mobileclip2_s2

注意：使用 MobileCLIP2 模型需要特殊配置，请参考"MobileCLIP2 模型特殊配置说明"部分。

### py/generate_caption.py

使用 MobileCLIP CoCa 模型为图像自动生成描述文本。

使用方法:
```bash
python py/generate_caption.py <图像路径> [模型名称]
```

示例:
```bash
# 使用默认模型 coca_ViT-L-14
python py/generate_caption.py images/sample.jpg

# 指定模型名称
python py/generate_caption.py images/sample.jpg coca_ViT-B-32
```

首次运行时会自动下载预训练模型，需要保持网络连接。

## 模型说明

### MobileCLIP 系列

- **MobileCLIP-S0**: 最小、最快的模型
- **MobileCLIP-S1**: 中等大小和速度
- **MobileCLIP-S2**: 最大、最准确的模型

### MobileCLIP2 系列

- **MobileCLIP2-S0**: 小模型
- **MobileCLIP2-S2**: 大模型

### CoCa 系列（图像描述生成）

- **coca_ViT-L-14**: 用于图像描述生成的 CoCa 模型（推荐）
- **coca_ViT-B-32**: 轻量级图像描述生成模型

## 相似度说明

系统使用余弦相似度来衡量文本和图片的相关性，值范围为 [-1, 1]：

- **0.8-1.0**: 高度相关
- **0.6-0.8**: 中度相关
- **0.4-0.6**: 轻度相关
- **0.0-0.4**: 基本不相关
- **负值**: 负相关（几乎不存在）

## 使用示例

```bash
# 搜索与"一只狗"相关的图片
python py/search_mobileclip.py "一只狗" mobileclip_s0

# 搜索与"海滩日落"相关的图片
python py/search_mobileclip.py "海滩日落" mobileclip_s1

# 为图像生成描述
python py/generate_caption.py images/sample.jpg
```

## 注意事项

1. 首次运行时会提取并缓存所有图片的特征，可能需要一些时间
2. 图片特征缓存保存在 `.cache` 目录中，后续搜索会更快
3. 不同模型的特征缓存是分开的
4. MobileCLIP2 模型需要特殊配置才能使用
5. 图像描述生成功能需要 CoCa 模型支持
6. 首次使用 CoCa 模型时需要网络连接以下载预训练权重
7. 生成的图像描述质量取决于模型能力和图像内容
8. 下载模型时如遇到网络问题，请参考"网络问题解决方案"部分