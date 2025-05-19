from sqlalchemy.orm import Session
from ..database.models import Employee, EmployeeSkill
from ..database.schemas import EmployeeCreate

def get_employee_by_id(db: Session, employee_id: int):
    """Get employee by ID"""
    return db.query(Employee).filter(Employee.id == employee_id).first()

def get_employee_by_email(db: Session, email: str):
    """Get employee by email"""
    return db.query(Employee).filter(Employee.email == email).first()

def create_employee(db: Session, employee: EmployeeCreate):
    """Create a new employee with skills"""
    # Generate random avatar
    avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={employee.name}"
    
    # Create employee without skills first
    db_employee = Employee(
        name=employee.name,
        position=employee.position,
        email=employee.email,
        avatar_url=avatar_url
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    
    # Add skills
    for skill in employee.skills:
        db_skill = EmployeeSkill(
            employee_id=db_employee.id,
            name=skill.name,
            level=skill.level
        )
        db.add(db_skill)
    
    db.commit()
    db.refresh(db_employee)
    return db_employee

def get_employee_with_skills(db: Session, employee_id: int):
    """Get employee with formatted skills"""
    employee = get_employee_by_id(db, employee_id)
    if not employee:
        return None
    
    # Convert skills to dictionary
    skills_dict = {skill.name: skill.level for skill in employee.skills}
    
    return {
        "id": employee.id,
        "name": employee.name,
        "position": employee.position,
        "email": employee.email,
        "avatar_url": employee.avatar_url,
        "skills": skills_dict
    }


def get_all_employees(db: Session):
    """Get all employees with their skills"""
    employees = db.query(Employee).all()
    return [get_employee_with_skills(db, employee.id) for employee in employees]