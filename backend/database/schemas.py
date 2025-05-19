from pydantic import BaseModel, EmailStr
from typing import Optional, Dict

class SkillsBase(BaseModel):
    python: float = 0
    sql: float = 0
    java: float = 0
    spark: float = 0
    react: float = 0
    docker: float = 0
    aws: float = 0

class EmployeeBase(BaseModel):
    name: str
    position: str
    email: str
    avatar_url: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    skills: SkillsBase

class EmployeeResponse(EmployeeBase):
    id: int
    skills: SkillsBase
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str

class LoginResponse(BaseModel):
    message: str
    employee_id: int
    redirect_url: str