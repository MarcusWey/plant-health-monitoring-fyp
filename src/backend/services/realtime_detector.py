from services.detection import detect_plants_from_frame
from services.trackers import update_tracks
from services.realtime_classifier import classify_crop
from services.langchain_agent import generate_prescription
from services.csv_handler import save_detection_to_csv
import cv2

saved_ids = set()

def detect_and_annotate_frame(frame):
    dets   = detect_plants_from_frame(frame)
    tracks = update_tracks(dets, frame)

    for t in tracks:
        x1,y1,x2,y2 = t["bbox"]
        tid = str(t["track_id"]).zfill(5)
        cv2.rectangle(frame,(x1,y1),(x2,y2),(0,255,0),2)
        cv2.putText(frame,f"ID:{tid} {t['label']}",(x1,y1-10),
                    cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,255,255),2)

        if tid not in saved_ids:
            saved_ids.add(tid)
            try:
                status,conf = classify_crop(frame,(x1,y1,x2,y2))
                prescription = generate_prescription(t["label"],status)
                save_detection_to_csv(tid,t["label"],status,conf,prescription)
                print(f"[SAVE] {tid} {t['label']} → {status} ({conf}%)")
            except Exception as e:
                print(f"[ERROR] Failed {tid}: {e}")

    return frame
