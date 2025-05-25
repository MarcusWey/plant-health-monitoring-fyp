import pandas as pd
import os

CSV_PATH = "runtime/detections.csv"

def initialize_csv():
    os.makedirs(os.path.dirname(CSV_PATH), exist_ok=True)
    if not os.path.exists(CSV_PATH):
        pd.DataFrame(columns=["id","plant","status","confidence","prescription"]) \
          .to_csv(CSV_PATH, index=False)

def save_detection_to_csv(track_id, plant, status, confidence, prescription):
    df = pd.read_csv(CSV_PATH)
    df = pd.concat([df, pd.DataFrame([{
      "id": track_id,
      "plant": plant,
      "status": status,
      "confidence": confidence,
      "prescription": prescription
    }])], ignore_index=True)
    df.to_csv(CSV_PATH, index=False)

def clear_csv():
    if os.path.exists(CSV_PATH):
        os.remove(CSV_PATH)
