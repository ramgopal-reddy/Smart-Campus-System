from sqlalchemy.orm import Session
from app.models import Attendance

def mark_attendance(db: Session, name: str):
    record = Attendance(student_name=name)
    db.add(record)
    db.commit()
