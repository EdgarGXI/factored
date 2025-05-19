import type { Employee, LoginRequest, LoginResponse } from "../types";

// Detectar si estamos en desarrollo o producción
const getApiBaseUrl = () => {
  // En desarrollo local, usar localhost:8000
  if (import.meta.env.DEV) {
    return "http://localhost:8000/api";
  }

  // En producción (Docker), usar la ruta relativa que será manejada por nginx
  return "/api";
};

const API_BASE_URL = getApiBaseUrl();

export async function loginUser(email: string): Promise<LoginResponse> {
  // Send a login request to the API
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email } as LoginRequest),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  return await response.json();
}

export async function getEmployeeProfile(
  // Fetch a single employee's profile from the API
  employeeId: number
): Promise<Employee> {
  const response = await fetch(`${API_BASE_URL}/employee/${employeeId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch employee: ${response.statusText}`);
  }

  return await response.json();
}

export const getAllEmployees = async (): Promise<Employee[]> => {
  // Fetch all employees from the API
  const response = await fetch(`${API_BASE_URL}/employees`);

  if (!response.ok) {
    const error = `Failed to fetch employees: ${response.statusText}`;
    console.error(error);
    throw new Error(error);
  }

  const data = await response.json();
  console.log("Employees data:", data);
  return data;
};
