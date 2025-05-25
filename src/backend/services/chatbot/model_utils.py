import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import cv2
from ultralytics import YOLO
import os
import base64

# ------------------ ResNet50 Classifier --------------------
class ResNet50(nn.Module):
    def __init__(self, num_classes=16):
        super(ResNet50, self).__init__()
        self.model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        for name, param in self.model.named_parameters():
            if "layer4" in name or "fc" in name:
                param.requires_grad = True
            else:
                param.requires_grad = False
        in_features = self.model.fc.in_features
        self.model.fc = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.model(x)

# Load ResNet
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
resnet_model = ResNet50(num_classes=16).to(device)
resnet_model.load_state_dict(torch.load("model/RESNET_12.pth", map_location=device))
resnet_model.eval()

class_names = sorted([
    'apple_black_rot', 'apple_healthy', 'apple_scab',
    'corn_common_rust', 'corn_healthy', 'corn_northern_blight',
    'grape_black_rot', 'grape_esca', 'grape_healthy',
    'pepper_bacterial_spot', 'pepper_healthy',
    'strawberry_healthy', 'strawberry_leaf_scorch',
    'tomato_bacterial_spot', 'tomato_healthy', 'tomato_septoria_leaf_spot'
])

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# ------------------ YOLOv8 Detector --------------------
yolo_model = YOLO("model/best.pt")
yolo_model.to("cpu")

ALLOWED_CLASSES = {
    "apple_leaf", "bell_pepper_leaf", "corn_leaf",
    "grape_leaf", "strawberry_leaf", "tomato_leaf"
}
THRESH = 0.15

# Main Detection + Classification Pipeline
def process_uploaded_image(image_path: str) -> dict:
    img = cv2.imread(image_path)
    results = yolo_model(img)[0]
    
    detections = []
    for box in results.boxes:
        conf = float(box.conf[0])
        label = yolo_model.names[int(box.cls[0])]
        if conf >= THRESH and label in ALLOWED_CLASSES:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            detections.append((x1, y1, x2, y2, label, conf))

    if detections:
        # if at least one allowed plant is detected
        for (x1, y1, x2, y2, label, conf) in detections:
            cv2.rectangle(img, (x1,y1), (x2,y2), (0,255,0), 2)
            cv2.putText(img, f"{label} {conf:.2f}", (x1, y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,255), 2)

        annotated_path = f"{os.path.splitext(image_path)[0]}_annotated.jpg"
        cv2.imwrite(annotated_path, img)

        with open(annotated_path, "rb") as f:
            base64_img = base64.b64encode(f.read()).decode()

        # Also do ResNet classification
        plant_status = predict_plant_condition(image_path)

        return {
            "detected": True,
            "plant_condition": plant_status,
            "annotated_image_base64": base64_img
        }
    else:
        return {
            "detected": False,
            "plant_condition": None,
            "annotated_image_base64": None
        }

# Basic ResNet-only classification
def predict_plant_condition(image_path: str) -> str:
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = resnet_model(input_tensor)
        probs = F.softmax(output[0], dim=0)
        top_class = torch.argmax(probs).item()
        confidence = probs[top_class].item()
    return f"{class_names[top_class]} ({confidence * 100:.2f}% confidence)"
