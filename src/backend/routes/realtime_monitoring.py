# backend/routes/realtime_monitoring.py

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import threading, time
import cv2

from services.realtime_detector import detect_and_annotate_frame
from services.csv_handler     import initialize_csv, clear_csv

router = APIRouter()

# ─── CONFIG ────────────────────────────────────────────────
IP_CAM_URL    = "http://192.168.68.101:8080/video"  # your phone-cam URL
CAPTURE_WIDTH  = 320
CAPTURE_HEIGHT = 240
# ─────────────────────────────────────────────────────────────

_running       = False
_frame_buffer  = None
_thread        = None

def _capture_loop():
    global _running, _frame_buffer

    cap = cv2.VideoCapture(IP_CAM_URL)
    if not cap.isOpened():
        print(f"[ERROR] Cannot open stream {IP_CAM_URL}")
        _running = False
        return

    # set desired resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH,  CAPTURE_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, CAPTURE_HEIGHT)

    initialize_csv()
    print(f"[INFO] Stream opened at {CAPTURE_WIDTH}×{CAPTURE_HEIGHT}")

    while _running:
        ret, frame = cap.read()
        if not ret:
            break

        annotated = detect_and_annotate_frame(frame)
        _, buf = cv2.imencode('.jpg', annotated)
        _frame_buffer = buf.tobytes()

        time.sleep(0.02)  # ~30 FPS

    cap.release()
    print("[INFO] Stream stopped.")

@router.post("/start-webcam")
def start_webcam():
    global _running, _thread
    if not _running:
        _running = True
        _thread  = threading.Thread(target=_capture_loop, daemon=True)
        _thread.start()
        return {"message": "Webcam started"}
    return {"message": "Already running"}

@router.post("/stop-webcam")
def stop_webcam():
    global _running
    _running = False
    time.sleep(1)
    clear_csv()
    return {"message": "Webcam stopped"}

@router.get("/video")
def video_feed():
    def streamer():
        while _running:
            if _frame_buffer:
                yield b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + _frame_buffer + b"\r\n"
            time.sleep(0.03)
    return StreamingResponse(streamer(),
                             media_type="multipart/x-mixed-replace; boundary=frame")
