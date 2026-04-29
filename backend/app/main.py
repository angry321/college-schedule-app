from fastapi import FastAPI
from fastapi import UploadFile, File
import shutil
import uuid
import os

from app.services.schedule.lessons_for_today import get_today_schedule
from app.services.schedule.lessons_for_week import get_week_schedule
from app.services.schedule.calls import get_calls_schedule


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ACTIVE_FILE_PATH = os.path.join(UPLOAD_DIR, "active.xlsx")

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/today")
def today():
    return get_today_schedule()

@app.get("/week")
def today():
    return get_week_schedule()

@app.get("/calls")
def today():
    return get_calls_schedule()

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    print("UPLOAD HIT")

    with open(ACTIVE_FILE_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
    "status": "ok",
    "file": file.filename
    }