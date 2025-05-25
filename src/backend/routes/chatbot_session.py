from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import shutil
import os

from services.chatbot.model_utils import process_uploaded_image
from services.chatbot.farmiz_chain import run_farmiz_chain

router = APIRouter()

active_sessions = {}

class BeginSessionRequest(BaseModel):
    user_id: str

class AskQuestionRequest(BaseModel):
    user_id: str
    question: str

@router.post("/begin-session")
def begin_session(request: BeginSessionRequest):
    user_id = request.user_id
    if user_id not in active_sessions:
        active_sessions[user_id] = {
            "plant_condition": None,
            "annotated_image_base64": None
        }
    return {"message": f"Session started for user {user_id}"}

@router.post("/upload-image")
def upload_image(user_id: str, file: UploadFile = File(...)):
    if user_id not in active_sessions:
        raise HTTPException(status_code=400, detail="Session not found. Please begin a session first.")

    os.makedirs("runtime", exist_ok=True)
    temp_path = f"runtime/temp_{user_id}.jpg"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = process_uploaded_image(temp_path)

    if not result["detected"]:
        return {"message": "No known plant detected.", "plant_condition": None}

    active_sessions[user_id]["plant_condition"] = result["plant_condition"]
    active_sessions[user_id]["annotated_image_base64"] = result["annotated_image_base64"]

    return {
        "message": "Plant detected and classified successfully.",
        "plant_condition": result["plant_condition"],
        "annotated_image_base64": result["annotated_image_base64"]
    }

@router.post("/ask")
def ask_question(request: AskQuestionRequest):
    user_id = request.user_id
    question = request.question

    if user_id not in active_sessions:
        raise HTTPException(status_code=400, detail="Session not found. Please begin a session first.")

    plant_condition = active_sessions[user_id].get("plant_condition", None)
    answer = run_farmiz_chain(plant_condition, question)
    return {"answer": answer}
