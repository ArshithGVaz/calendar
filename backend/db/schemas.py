from pydantic import BaseModel

class EmployeeCreate(BaseModel):
    name: str
    email: str
    role: str = "Nil"

class EmployeeRead(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        orm_mode = True

class TaskAssignedCreate(BaseModel):
    task_name: str
    assigned_by: str
    priority: str
    assigned_time: str

class TaskCompletedCreate(BaseModel):
    task_name: str
    assigned_by: str
    completed_time: str
