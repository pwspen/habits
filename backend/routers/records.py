from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas

router = APIRouter()

def get_db():    # same helper as above
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

USER_ID = 1  # placeholder

@router.put("/records/{record_id}", response_model=schemas.DashboardOut)
def update_record(record_id: int, body: schemas.RecordUpdate, db: Session = Depends(get_db)):
    rec = crud.update_record(db, record_id, body.value)
    if rec is None:
        raise HTTPException(status_code=409, detail="Record is locked")
    return crud.get_dashboard(db, USER_ID)