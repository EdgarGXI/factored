from pydantic import BaseModel
from typing import Optional, Dict, List

class SkillBase(BaseModel):
    name: str
    level: float

class SkillCreate(SkillBase):
    pass

class EmployeeCreate(BaseModel):
    name: str
    position: str
    email: str
    skills: List[SkillCreate]

class EmployeeBase(BaseModel):
    name: str
    position: str
    email: str

class EmployeeResponse(EmployeeBase):
    id: int
    avatar_url: Optional[str] = None
    skills: Dict[str, float]  # Dictionary with skill names as keys and levels as values
    
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str

class LoginResponse(BaseModel):
    message: str
    employee_id: int
    redirect_url: str