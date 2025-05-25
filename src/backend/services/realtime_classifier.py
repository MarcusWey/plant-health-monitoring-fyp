import torch, torch.nn as nn, cv2
from torchvision import models, transforms
from PIL import Image

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

CLASS_NAMES = sorted([
    'apple_black_rot','apple_healthy','apple_scab',
    'corn_common_rust','corn_healthy','corn_northern_blight',
    'grape_black_rot','grape_esca','grape_healthy',
    'pepper_bacterial_spot','pepper_healthy',
    'strawberry_healthy','strawberry_leaf_scorch',
    'tomato_bacterial_spot','tomato_healthy','tomato_septoria_leaf_spot'
])

class ResNet50(nn.Module):
    def __init__(self):
        super().__init__()
        m = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        for n,p in m.named_parameters():
            if "layer4" in n or "fc" in n: p.requires_grad=True
            else:                     p.requires_grad=False
        in_f = m.fc.in_features
        m.fc = nn.Sequential(
            nn.Linear(in_f,512), nn.ReLU(), nn.Dropout(0.3),
            nn.Linear(512,len(CLASS_NAMES))
        )
        self.model = m

    def forward(self,x): return self.model(x)

clf = ResNet50().to(device)
clf.load_state_dict(torch.load("model/RESNET_12.pth", map_location=device))
clf.eval()

tf = transforms.Compose([transforms.Resize((224,224)), transforms.ToTensor()])

def classify_crop(frame, bbox):
    x1,y1,x2,y2 = bbox
    h,w = frame.shape[:2]
    # clamp to avoid empty
    x1,y1 = max(0,x1), max(0,y1)
    x2,y2 = min(w,x2), min(h,y2)
    if x2<=x1 or y2<=y1:
        raise ValueError("Empty crop")
    crop = frame[y1:y2, x1:x2]
    img  = Image.fromarray(cv2.cvtColor(crop,cv2.COLOR_BGR2RGB))
    inp  = tf(img).unsqueeze(0).to(device)
    with torch.no_grad():
        out   = clf(inp)[0]
        probs = torch.softmax(out,dim=0)
        idx   = int(torch.argmax(probs))
        conf  = float(probs[idx])
    return CLASS_NAMES[idx], round(conf*100,2)
