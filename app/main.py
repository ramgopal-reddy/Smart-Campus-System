import base64
import cv2
import numpy as np
import json
from fastapi import FastAPI, WebSocket, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine, Base
from app.models import Student
from app.face_service import get_embedding, compare
from app.attendance_service import mark_attendance

app = FastAPI()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Register student
@app.websocket("/register")
async def register_student(ws: WebSocket):
    await ws.accept()
    name = await ws.receive_text()

    data = await ws.receive_text()
    img_bytes = base64.b64decode(data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    emb = get_embedding(frame)

    db = SessionLocal()
    student = Student(name=name, embedding=json.dumps(emb.tolist()))
    db.add(student)
    db.commit()
    db.close()

    await ws.send_text("Registered")

# Attendance scanning
@app.websocket("/scan")
async def scan(ws: WebSocket):
    await ws.accept()

    while True:
        data = await ws.receive_text()

        img_bytes = base64.b64decode(data)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        emb = get_embedding(frame)

        db = SessionLocal()
        students = db.query(Student).all()

        best_name = "Unknown"
        best_score = 0

        for s in students:
            score = compare(emb, s.embedding)
            if score > best_score and score > 0.6:
                best_name = s.name
                best_score = score

        if best_name != "Unknown":
            mark_attendance(db, best_name)

        db.close()

        await ws.send_text(best_name)
