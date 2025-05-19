from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from ..database.database import Base

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    position = Column(String)
    email = Column(String, unique=True, index=True)
    avatar_url = Column(String, nullable=True)
    
    # Relationship to skills
    skills = relationship("EmployeeSkill", back_populates="employee")

class EmployeeSkill(Base):
    __tablename__ = "employee_skills"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    name = Column(String)  # Skill name like "Python", "SQL", etc.
    level = Column(Float)  # Skill level (0-100)
    
    # Relationship to employee
    employee = relationship("Employee", back_populates="skills")