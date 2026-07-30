export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface SignupResponse {
  message: string;
  user: User;
  accessToken: string;
}

export interface AuthResponse {
  message: string;
  accessToken?: string;
  user: User;
}

export interface MessageResponse {
  message: string;
}