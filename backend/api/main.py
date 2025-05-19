from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ..database.database import engine, get_db
from ..database.models import Base
from ..routes.routes import router
from ..database.schemas import EmployeeCreate, SkillCreate
from ..database import crud



# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Profile API", version="1.0.0")

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Employee Profile API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Initialize with sample data
@app.on_event("startup")
async def create_sample_employees():
    """Create sample employees on startup if none exist"""
    db = next(get_db())
    
    # Check if we already have employees
    if db.query(crud.Employee).count() > 0:
        print("Sample employees already exist")
        return
    
    # List of sample employees with different skills
    sample_employees = [
        {
            "name": "John Doe",
            "position": "Senior Systems Engineer",
            "email": "john.doe@factored.com",
            "skills": [
                SkillCreate(name="Python", level=85.0),
                SkillCreate(name="SQL", level=90.0),
                SkillCreate(name="Java", level=70.0),
                SkillCreate(name="Spark", level=75.0),
                SkillCreate(name="React", level=80.0),
                SkillCreate(name="Docker", level=65.0),
                SkillCreate(name="AWS", level=70.0)
            ]
        },
        {
            "name": "Jane Smith",
            "position": "Data Scientist",
            "email": "jane.smith@factored.com",
            "skills": [
                SkillCreate(name="Python", level=92.0),
                SkillCreate(name="R", level=88.0),
                SkillCreate(name="TensorFlow", level=85.0),
                SkillCreate(name="SQL", level=75.0),
                SkillCreate(name="Pandas", level=95.0),
                SkillCreate(name="Spark", level=80.0)
            ]
        },
        {
            "name": "Alice Johnson",
            "position": "Frontend Developer",
            "email": "alice.johnson@factored.com",
            "skills": [
                SkillCreate(name="React", level=95.0),
                SkillCreate(name="TypeScript", level=90.0),
                SkillCreate(name="CSS", level=88.0),
                SkillCreate(name="HTML", level=92.0),
                SkillCreate(name="JavaScript", level=93.0),
                SkillCreate(name="Vue", level=75.0)
            ]
        },
        {
            "name": "Robert Chen",
            "position": "DevOps Engineer",
            "email": "robert.chen@factored.com",
            "skills": [
                SkillCreate(name="Docker", level=92.0),
                SkillCreate(name="Kubernetes", level=88.0),
                SkillCreate(name="AWS", level=90.0),
                SkillCreate(name="Terraform", level=85.0),
                SkillCreate(name="Python", level=75.0),
                SkillCreate(name="Jenkins", level=82.0)
            ]
        },
        {
            "name": "Maria Garcia",
            "position": "Backend Developer",
            "email": "maria.garcia@factored.com",
            "skills": [
                SkillCreate(name="Java", level=92.0),
                SkillCreate(name="Spring", level=88.0),
                SkillCreate(name="MongoDB", level=85.0),
                SkillCreate(name="PostgreSQL", level=90.0),
                SkillCreate(name="Microservices", level=87.0),
                SkillCreate(name="GraphQL", level=80.0)
            ]
        }
    ]
    
    created_count = 0
    # Create all sample employees
    for employee_data in sample_employees:
        employee = EmployeeCreate(
            name=employee_data["name"],
            position=employee_data["position"],
            email=employee_data["email"],
            skills=employee_data["skills"]
        )
        
        created_employee = crud.create_employee(db, employee)
        created_count += 1
        print(f"Created sample employee: {created_employee.name} (ID: {created_employee.id})")
    
    print(f"Created {created_count} sample employees")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)