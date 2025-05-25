from ultralytics import YOLO
import cv2

yolo_model = YOLO("model/best.pt")
yolo_model.to("cpu")

ALLOWED = {
  "apple_leaf","bell_pepper_leaf","corn_leaf",
  "grape_leaf","strawberry_leaf","tomato_leaf"
}
THRESH = 0.5

def detect_plants_from_frame(frame):
    results = yolo_model(frame)[0]
    out = []
    for box in results.boxes:
        conf = float(box.conf[0])
        label = yolo_model.names[int(box.cls[0])]
        if conf >= THRESH and label in ALLOWED:
            x1,y1,x2,y2 = map(int, box.xyxy[0])
            out.append({
                "bbox": (x1,y1,x2,y2),
                "confidence": conf,
                "label": label
            })
    return out

def annotate_image(image_path: str, detections: list, out_path: str):
    img = cv2.imread(image_path)
    for det in detections:
        x1, y1, x2, y2 = det["bbox"]
        lbl = det["label"]
        cf  = det["confidence"]
        cv2.rectangle(img, (x1, y1), (x2, y2), (0,255,0), 2)
        cv2.putText(img, f"{lbl} {cf:.2f}", (x1, y1-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,255), 2)
    cv2.imwrite(out_path, img)