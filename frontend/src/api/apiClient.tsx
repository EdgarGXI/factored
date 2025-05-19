import type { Employee, LoginRequest, LoginResponse } from "../types";

const API_BASE_URL = "http://localhost:8000/api";

export async function loginUser(email: string): Promise<LoginResponse> {
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
  employeeId: number
): Promise<Employee> {
  const response = await fetch(`${API_BASE_URL}/employee/${employeeId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch employee: ${response.statusText}`);
  }

  return await response.json();
}
