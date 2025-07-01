from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id       = Column(Integer, primary_key=True, index=True)
    email    = Column(String, unique=True, nullable=False)
    pwhash   = Column(String, nullable=False)
    timezone = Column(String, nullable=False)
    habits   = relationship("Habit", back_populates="user")

class Habit(Base):
    __tablename__ = "habits"
    id         = Column(Integer, primary_key=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    name       = Column(String, nullable=False)
    type       = Column(String, nullable=False)     # boolean / numeric
    polarity   = Column(String, nullable=False)     # good / bad
    start_value= Column(Integer, nullable=False)
    target     = Column(Integer, nullable=False)
    period     = Column(String, nullable=False)     # day / week / month / year
    active     = Column(Boolean, default=True)
    user       = relationship("User", back_populates="habits")
    records    = relationship("HabitRecord", back_populates="habit")

    __table_args__ = (
        CheckConstraint(type.in_(['boolean','numeric'])),
        CheckConstraint(polarity.in_(['good','bad'])),
        CheckConstraint(period.in_(['day','week','month','year'])),
    )


class HabitRecord(Base):
    __tablename__ = "habit_records"
    id         = Column(Integer, primary_key=True)
    habit_id   = Column(Integer, ForeignKey("habits.id"), nullable=False)
    date_start = Column(Date, nullable=False)
    period     = Column(String, nullable=False)
    value      = Column(Integer, nullable=False)
    locked     = Column(Boolean, default=False)
    habit      = relationship("Habit", back_populates="records")