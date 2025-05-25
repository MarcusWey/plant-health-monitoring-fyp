# backend/routes/realtime_detection_api.py

from fastapi import APIRouter, HTTPException, Query
import pandas as pd, os

router = APIRouter()
CSV = "runtime/detections.csv"

@router.get("/latest-id")
def latest_id():
    if not os.path.exists(CSV):
        return {"latest_id": None}
    df = pd.read_csv(CSV)
    return {"latest_id": None if df.empty else str(df.iloc[-1]["id"])}

@router.get("/result")
def result(id: str = Query(..., description="Track ID")):
    if not os.path.exists(CSV):
        raise HTTPException(404, "No CSV yet")
    df = pd.read_csv(CSV)
    row = df[df["id"].astype(str)==id]
    if row.empty:
        raise HTTPException(404, "ID not found")
    r = row.iloc[0]
    return {
        "id":           str(r["id"]),
        "plant":        str(r["plant"]),
        "status":       str(r["status"]),
        "confidence":   float(r["confidence"]),
        "prescription": str(r["prescription"]),
    }
