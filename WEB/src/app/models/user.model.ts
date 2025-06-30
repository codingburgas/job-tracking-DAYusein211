export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: UserRole;
  token: string;
}

export enum UserRole {
  User = 0,
  Admin = 1
}

export interface RegisterRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}