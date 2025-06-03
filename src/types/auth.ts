/**
 * Authentication related types
 */
import { AuthType, RoleType } from "./enum";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
}

// Client interface
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register user data
export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role?: RoleType;
}

// Authentication response
export interface AuthResponse {
  message: string;
  token: string;
  refreshToken: string;
  user?: User;
  client?: Client;
  type: AuthType;
}
