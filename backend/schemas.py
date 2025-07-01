from datetime import date
from pydantic import BaseModel

class HabitBase(BaseModel):
    name: str
    type: str
    polarity: str
    start_value: int
    target: int
    period: str
    active: bool = True

class HabitCreate(HabitBase):
    pass

class HabitOut(HabitBase):
    id: int
    class Config:
        from_attributes = True

class RecordUpdate(BaseModel):
    value: int

class RecordOut(BaseModel):
    id: int
    habit_id: int
    date_start: date
    period: str
    value: int
    locked: bool
    class Config:
        from_attributes = True

class DashboardOut(BaseModel):
    habits: list[HabitOut]
    records: list[RecordOut]