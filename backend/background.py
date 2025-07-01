from datetime import date, timedelta
from sqlalchemy.orm import Session
from .database import SessionLocal
from . import models

def rollover():
    db: Session = SessionLocal()
    today = date.today()
    unlocked = (db.query(models.HabitRecord)
    .filter(models.HabitRecord.locked==False,
    models.HabitRecord.date_start < today)
    .all())
    for rec in unlocked:
        rec.locked = True
        habit = rec.habit
        new_rec = models.HabitRecord(
        habit_id=habit.id,
        date_start=today,
        period=habit.period,
        value=habit.start_value
        )
        db.add(new_rec)
    db.commit()
    db.close()