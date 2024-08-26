from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Employee(Base):
    __tablename__ = 'employees'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String, default='Nil')

class TaskAssigned(Base):
    __tablename__ = 'tasks_assigned'

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey('employees.id'))
    task_name = Column(String)
    assigned_by = Column(String)
    priority = Column(String)
    assigned_time = Column(String)

class TaskCompleted(Base):
    __tablename__ = 'tasks_completed'

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey('employees.id'))
    task_name = Column(String)
    assigned_by = Column(String)
    completed_time = Column(String)
