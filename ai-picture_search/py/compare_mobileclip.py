#!/usr/bin/env python3
"""
比较 MobileCLIP 模型的效果
"""

import sys
import os
import json

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
    sys.exit(1)

def compare_model(model_name, model_path, query="dog"):
    """
    比较指定 MobileCLIP 模型的效果

    Args:
        model_name: 模型名称
        model_path: 模型文件路径
        query: 查询文本

    Returns:
        相似度结果
    """
    print(f"\n测试模型: {model_name}")
    print("-" * 40)

    # 检查模型文件是否存在
    if not os.path.exists(model_path):
        print(f"模型文件不存在: {model_path}")
        return None

    try:
        # MobileCLIP 模型使用官方方法加载
        model, _, preprocess = mobileclip.create_model_and_transforms(
            model_name,
            pretrained=model_path
        )
        tokenizer = mobileclip.get_tokenizer(model_name)

        model.eval()

        # 图片目录
        images_dir = os.path.join(os.path.dirname(__file__), '../images')

        # 获取所有图片文件
        image_files = [f for f in os.listdir(images_dir)
                      if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]

        # 提取查询文本的特征
        text_tokens = tokenizer([query])
        with torch.no_grad():
            text_features = model.encode_text(text_tokens)
            text_features /= text_features.norm(dim=-1, keepdim=True)

        # 计算与所有图片的相似度
        similarities = []
        for image_file in image_files:  # 移除数量限制
            image_path = os.path.join(images_dir, image_file)
            try:
                image = Image.open(image_path).convert('RGB')
                image = preprocess(image).unsqueeze(0)

                with torch.no_grad():
                    image_features = model.encode_image(image)
                    image_features /= image_features.norm(dim=-1, keepdim=True)

                # 使用余弦相似度
                similarity = cosine_similarity(text_features.cpu().numpy(), image_features.cpu().numpy())[0][0]
                similarities.append((image_file, similarity))
                print(f"{image_file}: {similarity:.4f}")
            except Exception as e:
                print(f"处理图片 {image_file} 时出错: {e}")

        # 按相似度降序排序
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities

    except Exception as e:
        print(f"测试模型 {model_name} 时出错: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    """
    主函数
    """
    # 定义要测试的 MobileCLIP 模型
    models = [
        ('mobileclip_s0', 'mobileclip_s0.pt'),
        ('mobileclip_s1', 'mobileclip_s1.pt'),
        ('mobileclip_s2', 'mobileclip_s2.pt'),
    ]

    query = "dog" if len(sys.argv) < 2 else sys.argv[1]
    print(f"查询文本: {query}")

    # 测试所有模型
    results = {}
    for model_name, model_file in models:
        model_path = os.path.join(os.path.dirname(__file__), '../models', model_file)
        result = compare_model(model_name, model_path, query)
        if result:
            results[model_name] = result

    # 比较结果
    print(f"\n\nMobileCLIP 模型比较结果 (查询: '{query}'):")
    print("=" * 60)
    print(f"{'模型':<20} {'最佳匹配图片':<25} {'相似度':<10}")
    print("-" * 60)

    for model_name, similarities in results.items():
        if similarities:
            best_match, best_score = similarities[0]
            print(f"{model_name:<20} {best_match:<25} {best_score:<10.4f}")
        else:
            print(f"{model_name:<20} {'错误':<25} {'N/A':<10}")

if __name__ == "__main__":
    main()
