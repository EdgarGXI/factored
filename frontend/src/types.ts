export interface Skill {
  python: number;
  sql: number;
  java: number;
  spark: number;
  react: number;
  docker: number;
  aws: number;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  avatar_url: string;
  skills: Skill;
}

export interface LoginRequest {
  email: string;
}

export interface LoginResponse {
  message: string;
  employee_id: number;
  redirect_url: string;
}
