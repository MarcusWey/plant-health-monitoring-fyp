from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.realtime_monitoring import router as monitor_router
from routes.realtime_detection_api import router as detect_router
from routes.chatbot_session import router as chatbot_router

app = FastAPI()

# Allow Next.js dev server to talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(monitor_router, prefix="/realtime")
app.include_router(detect_router, prefix="/realtime")
app.include_router(chatbot_router, prefix="/chatbot")   

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)