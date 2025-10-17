#!/usr/bin/env python3
"""
使用 MobileCLIP 实现的图像搜索脚本
支持通过 command line 参数指定模型名称
"""

import sys
import os

# 添加 ml-mobileclip 到系统路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'ml-mobileclip'))

try:
    import torch
    from PIL import Image
    import mobileclip
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError as e:
    print(f"导入模块失败: {e}")
    print("请确保已安装所需依赖:")
    print("pip install torch torchvision pillow scikit-learn")
    sys.exit(1)

class MobileClipSearchEngine:
    def __init__(self, model_name='mobileclip_s0', model_path=None):
        """
        初始化 MobileCLIP 搜索引擎
        
        Args:
            model_name: 模型名称 (默认: mobileclip_s0)
            model_path: 模型文件路径
        """
        self.model_name = model_name
        self.model_path = model_path or os.path.join(os.path.dirname(__file__), '..', 'models', f'{model_name}.pt')
        
        # 检查模型文件是否存在
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"模型文件不存在: {self.model_path}")
        
        print(f"正在加载模型: {model_name}")
        
        # MobileCLIP 模型使用官方方法加载
        self.model, _, self.preprocess = mobileclip.create_model_and_transforms(
            self.model_name, 
            pretrained=self.model_path
        )
        self.tokenizer = mobileclip.get_tokenizer(self.model_name)
        
        self.model.eval()
        
        # 图片目录
        self.images_dir = os.path.join(os.path.dirname(__file__), '..', 'images')
        
        # 检查图片目录是否存在
        if not os.path.exists(self.images_dir):
            raise FileNotFoundError(f"图片目录不存在: {self.images_dir}")
        
        # 缓存目录
        self.cache_dir = os.path.join(os.path.dirname(__file__), '..', '.cache')
        os.makedirs(self.cache_dir, exist_ok=True)
        
        # 特征缓存文件 (根据模型名称区分缓存)
        self.features_cache = os.path.join(self.cache_dir, f'features_{model_name}.json')
        
        # 存储图片特征
        self.image_features = {}
        self.load_features()
    
    def extract_image_features(self, image_path):
        """
        提取单张图片的特征向量
        
        Args:
            image_path: 图片路径
            
        Returns:
            图片特征向量
        """
        try:
            image = Image.open(image_path).convert('RGB')
            image = self.preprocess(image).unsqueeze(0)
            
            with torch.no_grad():
                image_features = self.model.encode_image(image)
                image_features /= image_features.norm(dim=-1, keepdim=True)
                
            return image_features.cpu().numpy()
        except Exception as e:
            print(f"处理图片 {image_path} 时出错: {e}")
            return None
    
    def extract_text_features(self, text):
        """
        提取文本的特征向量
        
        Args:
            text: 输入文本
            
        Returns:
            文本特征向量
        """
        try:
            text_tokens = self.tokenizer([text])
            
            with torch.no_grad():
                text_features = self.model.encode_text(text_tokens)
                text_features /= text_features.norm(dim=-1, keepdim=True)
                
            return text_features.cpu().numpy()
        except Exception as e:
            print(f"处理文本 '{text}' 时出错: {e}")
            return None
    
    def load_features(self):
        """
        从缓存加载图片特征，如果缓存不存在则创建
        """
        if os.path.exists(self.features_cache):
            try:
                import json
                with open(self.features_cache, 'r') as f:
                    cached_data = json.load(f)
                    # 将列表转换回 numpy 数组
                    self.image_features = {
                        path: np.array(features) 
                        for path, features in cached_data.items()
                    }
                print(f"从缓存加载了 {len(self.image_features)} 张图片的特征")
            except Exception as e:
                print(f"加载缓存时出错: {e}")
                self.image_features = {}
        
        # 获取所有图片文件
        image_files = [f for f in os.listdir(self.images_dir) 
                      if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
        
        # 检查是否有新图片需要处理
        updated = False
        for image_file in image_files:
            image_path = os.path.join(self.images_dir, image_file)
            if image_path not in self.image_features:
                print(f"正在处理新图片: {image_file}")
                features = self.extract_image_features(image_path)
                if features is not None:
                    self.image_features[image_path] = features
                    updated = True
        
        # 如果有新图片处理，保存到缓存
        if updated:
            self.save_features()
    
    def save_features(self):
        """
        保存图片特征到缓存
        """
        import json
        # 将 numpy 数组转换为列表以便 JSON 序列化
        cacheable_data = {
            path: features.tolist() 
            for path, features in self.image_features.items()
        }
        
        with open(self.features_cache, 'w') as f:
            json.dump(cacheable_data, f)
        print(f"已将 {len(self.image_features)} 张图片的特征保存到缓存")
    
    def search(self, query, top_k=5):
        """
        根据文本查询搜索最相似的图片
        
        Args:
            query: 查询文本
            top_k: 返回最相似的 K 张图片
            
        Returns:
            包含图片路径和相似度的列表
        """
        # 提取查询文本的特征
        query_features = self.extract_text_features(query)
        if query_features is None:
            return []
        
        # 计算与所有图片的相似度
        similarities = []
        for image_path, image_feature in self.image_features.items():
            # 使用余弦相似度
            similarity = cosine_similarity(query_features, image_feature)[0][0]
            similarities.append((image_path, similarity))
        
        # 按相似度降序排序
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # 返回前 top_k 个结果
        return similarities[:top_k]

def print_results_as_table(results):
    """
    以表格形式打印搜索结果
    
    Args:
        results: 搜索结果列表，每个元素为 (image_path, similarity) 元组
    """
    if not results:
        print("未找到任何结果")
        return
    
    # 打印表头
    print("\n搜索结果:")
    print("-" * 60)
    print(f"{'排名':<4} {'文件名':<30} {'相似度':<10}")
    print("-" * 60)
    
    # 打印结果
    for i, (image_path, similarity) in enumerate(results, 1):
        filename = os.path.basename(image_path)
        print(f"{i:<4} {filename:<30} {similarity:<10.4f}")

def main():
    """
    主函数
    """
    if len(sys.argv) < 2:
        print("使用方法: python search_mobileclip.py <查询文本> [模型名称]")
        print("示例: python search_mobileclip.py \"一只狗\" mobileclip_s0")
        print("支持的模型:")
        print("  MobileCLIP 系列: mobileclip_s0, mobileclip_s1, mobileclip_s2")
        return
    
    query = sys.argv[1]
    model_name = sys.argv[2] if len(sys.argv) > 2 else 'mobileclip_s0'
    
    print(f"正在搜索: {query}")
    print(f"使用模型: {model_name}")
    
    try:
        # 创建搜索引擎实例
        search_engine = MobileClipSearchEngine(model_name)
        
        # 执行搜索
        results = search_engine.search(query, top_k=5)
        
        # 以表格形式显示结果
        print_results_as_table(results)
        
    except Exception as e:
        print(f"搜索过程中出错: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()