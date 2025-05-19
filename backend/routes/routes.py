from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..database.schemas import LoginRequest, LoginResponse, EmployeeResponse
from ..database import crud

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login that checks if employee exists"""
    employee = crud.get_employee_by_email(db, login_data.email)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return LoginResponse(
        message="Login successful",
        employee_id=employee.id,
        redirect_url=f"/profile/{employee.id}"
    )

@router.get("/employee/{employee_id}", response_model=EmployeeResponse)
async def get_employee_profile(employee_id: int, db: Session = Depends(get_db)):
    """Get employee profile with skills"""
    employee_data = crud.get_employee_with_skills(db, employee_id)
    if not employee_data:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return EmployeeResponse(**employee_data)

@router.get("/employees", response_model=List[EmployeeResponse])
async def get_all_employees(db: Session = Depends(get_db)):
    """Get all employee profiles"""
    employees = crud.get_all_employees(db)
    return employees