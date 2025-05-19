"use client";

import { createContext, useState, useContext, type ReactNode } from "react";
import type { Employee } from "../types";
import { loginUser } from "../api/apiClient";

interface AuthContextType {
  currentUser: Employee | null;
  login: (email: string) => Promise<{ success: boolean; employeeId?: number }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);

  const login = async (
    email: string
  ): Promise<{ success: boolean; employeeId?: number }> => {
    try {
      const response = await loginUser(email);

      // Not setting the current user here since we'll fetch
      // the full profile in the profile page
      return {
        success: true,
        employeeId: response.employee_id,
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
