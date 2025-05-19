# Factored Employee Portal

## Overview

A full-stack web application for managing employee profiles and skills tracking with different access levels for employees and administrators.

## How to install:

- Install Docker Desktop on your PC `https://www.docker.com/get-started/`
- Open Docker Desktop
- If you have git installed on your PC, simply create a new folder open a terminal (cmd) and paste this to clone the repo: `git clone https://github.com/EdgarGXI/factored.git`
- Else, if you don't have git, you can simply download the .zip file clicking on the green button that says `Code` and selecting the `Download ZIP` option
- Once you have downloaded the repo (If you downloaded the ZIP file, extract it), open a new terminal on the `factored` folder, or if you already had one running for cloning the repo, type `cd factored`
- On the terminal, type `docker build -t factored-app .`, after it finishes running, type `docker run -p 80:80 factored-app`

## How to use

1. **Access the application**: Open `http://localhost` in your browser
2. **Login**:
   - Regular user: Use `john.doe@factored.com` (or any other sample employee email)
   - Admin: Use `admin@factored.com` to access the employee dashboard

## For Devs:

### Frontend

- React with TypeScript
- Vite as build tool
- Material UI for component library
- Tailwind CSS for styling
- React Router for navigation

### Backend

- FastAPI (Python)
- SQLAlchemy ORM
- SQLite database
- Pydantic for data validation

### Deployment

- Docker containerization
- Nginx for serving frontend and proxying API requests
- Supervisord for process management

## Features

- **Authentication**: Simple email-based authentication
- **User Profiles**: Detailed employee profiles with skill visualizations
- **Admin Dashboard**: View and search all employees

## API Endpoints

- `POST /api/login` - User authentication
- `GET /api/employee/{id}` - Get employee profile
- `GET /api/employees` - Get all employees (admin)

## Disclaimer

- For the sake of the assesment, both backend and frontend are on the same repo in an attempt to provide just one link and make the the process to run more swiftly
