from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Date, MetaData, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import text

app = FastAPI()

# Database Connection
SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://user:password@localhost/dbname"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Model Definition
class Employee(Base):
    __tablename__ = 'employees'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email_id = Column(String(255), unique=True, index=True)
    employee_id = Column(String(255), unique=True)
    phone_number = Column(String(255))
    manager = Column(String(255))
    manager_id = Column(String(255))

# Pydantic Models for Data Validation
class EmployeeBase(BaseModel):
    name: str
    email_id: str
    employee_id: str
    phone_number: str
    manager: str
    manager_id: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: str = None
    email_id: str = None
    phone_number: str = None
    manager: str = None
    manager_id: str = None

# Create the database tables
Base.metadata.create_all(bind=engine)

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/employees/", response_model=EmployeeBase)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    # Insert the new employee into the general employees table
    db_employee = Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    
    # Dynamically create a task table for the new employee
    create_task_table(db_employee.employee_id)
    
    return db_employee

@app.get("/employees/", response_model=list[EmployeeBase])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Employee).offset(skip).limit(limit).all()

def create_task_table(employee_id):
    metadata = MetaData(bind=engine)
    table_name = f"{employee_id}_Task_Sheet"
    task_table = Table(table_name, metadata,
                       Column('id', Integer, primary_key=True),
                       Column('task_title', String(255)),
                       Column('assigned_date', Date),
                       Column('todays_date', Date),
                       Column('assigned_by', String(255)),
                       Column('completed_date', Date),
                       Column('priority', String(50))
                       )
    metadata.create_all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
