from deep_sort_realtime.deepsort_tracker import DeepSort

tracker = DeepSort(max_age=30, n_init=3, max_iou_distance=0.7)

def update_tracks(detections, frame):
    inp = []
    for d in detections:
        x1,y1,x2,y2 = d["bbox"]
        inp.append(([x1,y1, x2-x1, y2-y1], d["confidence"], d["label"]))
    tracks = tracker.update_tracks(inp, frame=frame)
    out=[]
    for t in tracks:
        if not t.is_confirmed(): continue
        l,t_y,w,h = t.to_ltwh()
        out.append({
            "track_id": t.track_id,
            "bbox": (int(l),int(t_y),int(l+w),int(t_y+h)),
            "label": t.det_class
        })
    return out
