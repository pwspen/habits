from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

USER_ID = 1  # placeholder until auth

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