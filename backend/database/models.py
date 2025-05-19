from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    position = Column(String)
    email = Column(String, unique=True, index=True)
    avatar_url = Column(String, nullable=True)
    
    # Skills as JSON-like string
    # Each skill has a name and proficiency level
    python_skill = Column(Float, default=0)
    sql_skill = Column(Float, default=0)
    java_skill = Column(Float, default=0)
    spark_skill = Column(Float, default=0)
    react_skill = Column(Float, default=0)
    docker_skill = Column(Float, default=0)
    aws_skill = Column(Float, default=0)