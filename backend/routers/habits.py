from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas, models
from datetime import date
from typing import Dict, Any
from loguru import logger

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

USER_ID = 1  # placeholder until auth

def _check_rollover_needed(db: Session) -> Dict[str, Any]:
    """
    Check if any habits need rollover and return status info.
    Returns dict with 'needs_rollover' bool and 'records_to_rollover' list.
    """
    today = date.today()
    unlocked = (db.query(models.HabitRecord)
                .join(models.Habit)  # Join with habits table
                .filter(models.HabitRecord.locked == False)
                .filter(models.Habit.active == True)  # Only active habits
                .all())
    
    records_to_rollover = []
    for rec in unlocked:
        habit = rec.habit
        rollover_time = False
        logger.info(f"checking rec with {rec.period=}, {rec.date_start=}")
        
        if habit.period == "day" and rec.date_start < today:
            rollover_time = True
        elif habit.period == "week" and (today - rec.date_start).days >= 7:
            rollover_time = True
        elif habit.period == "month":
            # Check if we've moved to a new month
            if today.month != rec.date_start.month or today.year != rec.date_start.year:
                rollover_time = True
        elif habit.period == "year":
            # Check if we've moved to a new year
            if today.year != rec.date_start.year:
                rollover_time = True
        
        if rollover_time:
            records_to_rollover.append(rec)
    
    return {
        'needs_rollover': len(records_to_rollover) > 0,
        'records_to_rollover': records_to_rollover,
        'count': len(records_to_rollover)
    }

@router.post("/habits", response_model=schemas.DashboardOut)
def create_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db)):
    crud.create_habit(db, USER_ID, habit)
    return crud.get_dashboard(db, USER_ID)

@router.put("/habits/{habit_id}", response_model=schemas.DashboardOut)
def edit_habit(habit_id: int, habit: schemas.HabitCreate, db: Session = Depends(get_db)):
    crud.update_habit(db, habit_id, habit)
    return crud.get_dashboard(db, USER_ID)

@router.get("/dashboard", response_model=schemas.DashboardOut)
def dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard(db, USER_ID)

@router.get("/rollover/check")
def check_rollover_needed(db: Session = Depends(get_db)):
    """Check if any habits need to be rolled over without performing the rollover."""
    rollover_info = _check_rollover_needed(db)
    logger.info(rollover_info)
    return rollover_info['needs_rollover']

@router.post("/rollover", response_model=schemas.DashboardOut)
def perform_rollover(db: Session = Depends(get_db)):
    """Perform rollover for any habits that need it and return updated dashboard."""
    rollover_info = _check_rollover_needed(db)
    
    if rollover_info['needs_rollover']:
        records_to_rollover = rollover_info['records_to_rollover']

        today = date.today()

        for rec in records_to_rollover:
            habit = rec.habit
            
            # Lock the old record
            rec.locked = True
            
            # Create new record
            new_rec = models.HabitRecord(
                habit_id=habit.id,
                date_start=today,
                period=habit.period,
                value=habit.start_value
            )
            db.add(new_rec)
        
        db.commit()
    
    return crud.get_dashboard(db, USER_ID)