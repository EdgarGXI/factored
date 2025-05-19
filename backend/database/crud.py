from sqlalchemy.orm import Session
from models import Employee
from schemas import EmployeeCreate, SkillsBase

def get_employee_by_id(db: Session, employee_id: int):
    """Get employee by ID"""
    return db.query(Employee).filter(Employee.id == employee_id).first()

def get_employee_by_email(db: Session, email: str):
    """Get employee by email"""
    return db.query(Employee).filter(Employee.email == email).first()

def create_employee(db: Session, employee: EmployeeCreate):
    """Create a new employee"""
    # Generate random avatar using DiceBear API
    avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={employee.name}"
    
    db_employee = Employee(
        name=employee.name,
        position=employee.position,
        email=employee.email,
        avatar_url=avatar_url,
        python_skill=employee.skills.python,
        sql_skill=employee.skills.sql,
        java_skill=employee.skills.java,
        spark_skill=employee.skills.spark,
        react_skill=employee.skills.react,
        docker_skill=employee.skills.docker,
        aws_skill=employee.skills.aws
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def get_employee_with_skills(db: Session, employee_id: int):
    """Get employee with formatted skills"""
    employee = get_employee_by_id(db, employee_id)
    if not employee:
        return None
    
    # Format skills for frontend
    skills = SkillsBase(
        python=employee.python_skill,
        sql=employee.sql_skill,
        java=employee.java_skill,
        spark=employee.spark_skill,
        react=employee.react_skill,
        docker=employee.docker_skill,
        aws=employee.aws_skill
    )
    
    return {
        "id": employee.id,
        "name": employee.name,
        "position": employee.position,
        "email": employee.email,
        "avatar_url": employee.avatar_url,
        "skills": skills
    }
