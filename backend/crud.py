from sqlalchemy.orm import Session
from datetime import date
import models, schemas
from loguru import logger

def get_dashboard(db: Session, user_id: int) -> schemas.DashboardOut:
    habits = (db.query(models.Habit)
              .filter(models.Habit.user_id == user_id, 
                     models.Habit.active == True)
              .all())
        
    records = (db.query(models.HabitRecord)
               .join(models.Habit)
               .filter(models.Habit.user_id == user_id,
                      models.HabitRecord.locked == False)
               .all())
    
    return schemas.DashboardOut(habits=habits, records=records)

def create_habit(db: Session, user_id: int, habit: schemas.HabitCreate):
    db_habit = models.Habit(user_id=user_id, **habit.dict())
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    # create initial record
    rec = models.HabitRecord(
        habit_id=db_habit.id,
        date_start=date.today(),
        period=db_habit.period,
        value=db_habit.start_value
    )
    db.add(rec)
    db.commit()
    return db_habit

def update_habit(db: Session, habit_id: int, habit: schemas.HabitCreate):
    db_habit = db.query(models.Habit).get(habit_id)
    logger.info(f"Update habit")
    for k,v in habit.dict().items():
        logger.info(k, v)
        setattr(db_habit, k, v)
    db.commit()
    db.refresh(db_habit)
    return db_habit

def update_record(db: Session, record_id: int, value: int):
    rec = db.query(models.HabitRecord).get(record_id)
    logger.info(f"Update record: {value}")
    if not rec:
        return None
    if rec.locked:
        return None
    rec.value = value
    db.commit()
    db.refresh(rec)
    return rec