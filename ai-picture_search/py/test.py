import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'ml-mobileclip'))

import torch
import open_clip
from PIL import Image
from mobileclip.modules.common.mobileone import reparameterize_model

# 使用 MobileCLIP2-S0 模型，这是 open_clip 支持的模型
model, _, preprocess = open_clip.create_model_and_transforms(
    'MobileCLIP2-S0',  
    pretrained=os.path.join(os.path.dirname(__file__), 'models', 'mobileclip2_s0.pt')
)
tokenizer = open_clip.get_tokenizer('MobileCLIP2-S0')

# Model needs to be in eval mode for inference because of batchnorm layers unlike ViTs
model.eval()

# For inference/model exporting purposes, please reparameterize first
model = reparameterize_model(model)

# 使用实际存在的图片文件
image_files = os.listdir(os.path.join(os.path.dirname(__file__), 'images'))
first_image = os.path.join(os.path.dirname(__file__), 'images', image_files[0])
print(f"Using image: {first_image}")

image = preprocess(Image.open(first_image).convert('RGB')).unsqueeze(0)
text = tokenizer(["a diagram", "a dog", "a cat"])

with torch.no_grad(), torch.cuda.amp.autocast():
    image_features = model.encode_image(image)
    text_features = model.encode_text(text)
    image_features /= image_features.norm(dim=-1, keepdim=True)
    text_features /= text_features.norm(dim=-1, keepdim=True)

    text_probs = (100.0 * image_features @ text_features.T).softmax(dim=-1)

print("Label probs:", text_probs)