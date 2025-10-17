#!/usr/bin/env python3
"""
使用 MobileCLIP CoCa 模型生成图像描述
"""

import sys
import os

# 添加 ml-mobileclip 到系统路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'ml-mobileclip'))

try:
    import torch
    import open_clip
    from PIL import Image
    # 手动导入 transformers 相关模块以确保 OpenCLIP 能检测到它们
    import transformers
    from transformers import LogitsProcessorList, MinLengthLogitsProcessor, TopPLogitsWarper, TopKLogitsWarper, RepetitionPenaltyLogitsProcessor
    # 更新 OpenCLIP 中的引用
    open_clip.coca_model.LogitsProcessorList = LogitsProcessorList
    open_clip.coca_model.MinLengthLogitsProcessor = MinLengthLogitsProcessor
    open_clip.coca_model.TopPLogitsWarper = TopPLogitsWarper
    open_clip.coca_model.TopKLogitsWarper = TopKLogitsWarper
    open_clip.coca_model.RepetitionPenaltyLogitsProcessor = RepetitionPenaltyLogitsProcessor
    open_clip.coca_model._has_transformers = True
except ImportError as e:
    print(f"导入模块失败: {e}")
    print("请确保已安装所需依赖:")
    print("pip install torch torchvision pillow transformers")
    sys.exit(1)

# 确保 OpenCLIP 能检测到 transformers
open_clip.coca_model._has_transformers = True

class ImageCaptionGenerator:
    def __init__(self, model_name='coca_ViT-L-14', model_path=None):
        """
        初始化图像描述生成器
        
        Args:
            model_name: 模型名称 (默认: coca_ViT-L-14)
            model_path: 模型文件路径
        """
        self.model_name = model_name
        # 检查是否提供了模型路径
        if model_path:
            self.model_path = model_path
        else:
            # 检查 models 目录下是否有对应的模型文件
            local_model_path = os.path.join(os.path.dirname(__file__), '..', 'models', f'{model_name}.pt')
            open_clip_model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'open_clip_pytorch_model.bin')
            
            # 优先使用 .pt 文件，如果没有则使用 open_clip_pytorch_model.bin
            if os.path.exists(local_model_path):
                self.model_path = local_model_path
            elif os.path.exists(open_clip_model_path):
                self.model_path = open_clip_model_path
            else:
                self.model_path = None
        
        # 检查模型文件是否存在
        if self.model_path and os.path.exists(self.model_path):
            print(f"正在加载本地模型: {self.model_path}")
            # 加载模型
            try:
                self.model, _, self.preprocess = open_clip.create_model_and_transforms(
                    model_name, 
                    pretrained=self.model_path
                )
                self.model.eval()
            except Exception as e:
                print(f"加载本地模型失败: {e}")
                print("尝试使用预训练模型...")
                self._load_pretrained_model()
        else:
            print(f"警告: 本地模型文件不存在: {self.model_path}")
            print("将尝试使用 OpenCLIP 的预训练模型...")
            self._load_pretrained_model()
    
    def _load_pretrained_model(self):
        """
        加载 OpenCLIP 预训练模型
        """
        try:
            print(f"正在从 OpenCLIP 加载预训练模型: {self.model_name}")
            print("注意: 首次运行需要下载模型文件，可能需要较长时间，请保持网络连接...")
            self.model, _, self.preprocess = open_clip.create_model_and_transforms(
                self.model_name, 
                pretrained='laion2b_s13b_b90k'  # 默认预训练权重
            )
            self.model.eval()
            print("成功加载预训练模型")
        except Exception as e:
            print(f"加载预训练模型失败: {e}")
            print("\n可能的解决方案:")
            print("1. 检查网络连接")
            print("2. 如果网络不稳定，可以尝试:")
            print("   - 使用 VPN 或代理")
            print("   - 手动下载模型文件并放置在 models/ 目录中")
            print("   - 稍后再试")
            print("3. 查看是否安装了所有必要的依赖")
            raise e
        
    def generate_caption(self, image_path, generation_type="top_p", top_p=0.9):
        """
        为图像生成描述
        
        Args:
            image_path: 图像路径
            generation_type: 生成类型
            top_p: top-p 采样参数
            
        Returns:
            生成的图像描述
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"图像文件不存在: {image_path}")
        
        try:
            # 处理图像
            image = Image.open(image_path).convert('RGB')
            image = self.preprocess(image).unsqueeze(0)
            
            # 生成描述
            with torch.no_grad(), torch.cuda.amp.autocast():
                generated_text = self.model.generate(
                    image,
                    generation_type=generation_type,
                    top_p=top_p,
                    fixed_output_length=True
                )[0]
                
                # 解码生成的文本
                caption = open_clip.decode(generated_text).split("<end_of_text>")[0].split("<start_of_text>")[-1].split(".")[0].rstrip()
                
            return caption
        except Exception as e:
            print(f"生成图像描述时出错: {e}")
            import traceback
            traceback.print_exc()
            return None

def main():
    """
    主函数
    """
    if len(sys.argv) < 2:
        print("使用方法: python generate_caption.py <图像路径> [模型名称]")
        print("示例: python generate_caption.py images/dog.jpg coca_ViT-L-14")
        print("\n支持的模型:")
        print("- coca_ViT-L-14 (默认，推荐)")
        print("- coca_ViT-B-32")
        print("\n注意:")
        print("- 如果未找到本地模型文件，将自动使用 OpenCLIP 预训练模型")
        print("- 首次使用预训练模型时需要联网下载 (约2.5GB)")
        print("- 下载过程中请保持网络连接稳定")
        return
    
    image_path = sys.argv[1]
    model_name = sys.argv[2] if len(sys.argv) > 2 else 'coca_ViT-L-14'
    
    print(f"正在为图像生成描述: {image_path}")
    print(f"使用模型: {model_name}")
    
    try:
        # 创建图像描述生成器实例
        caption_generator = ImageCaptionGenerator(model_name)
        
        # 生成描述
        caption = caption_generator.generate_caption(image_path)
        
        if caption:
            print(f"\n生成的图像描述:\n{caption}")
        else:
            print("未能生成图像描述")
        
    except Exception as e:
        print(f"生成图像描述过程中出错: {e}")
        print("\n请尝试以下解决方案:")
        print("1. 确保图像文件存在且格式正确")
        print("2. 检查网络连接（如果使用预训练模型）")
        print("3. 如果网络不稳定，可以尝试:")
        print("   - 使用 VPN 或代理")
        print("   - 手动下载模型文件并放置在 models/ 目录中")
        print("   - 稍后再试")
        print("4. 查看是否安装了所有必要的依赖")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()