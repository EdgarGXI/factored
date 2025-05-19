from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ..database.database import engine, get_db
from ..database.models import Base
from ..routes.routes import router
from ..database.schemas import EmployeeCreate, SkillsBase
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
async def create_sample_employee():
    """Create a sample employee on startup if none exists"""
    db = next(get_db())
    
    # Check if we already have employees
    existing_employee = crud.get_employee_by_email(db, "john.doe@factored.com")
    if existing_employee:
        print("Sample employee already exists")
        return
    
    # Create sample employee
    sample_skills = SkillsBase(
        python=85.0,
        sql=90.0,
        java=70.0,
        spark=75.0,
        react=80.0,
        docker=65.0,
        aws=70.0
    )
    
    sample_employee = EmployeeCreate(
        name="John Doe",
        position="Senior Systems Engineer",
        email="john.doe@factored.com",
        skills=sample_skills
    )
    
    created_employee = crud.create_employee(db, sample_employee)
    print(f"Created sample employee: {created_employee.name} (ID: {created_employee.id})")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)