// ==========================================
// USER
// ==========================================

export interface User {
  id: string;

  fullName: string;

  username: string;

  email: string;

  phone?: string | null;

  bio?: string | null;

  avatar?: string | null;

  createdAt: string;
}


// ==========================================
// LOGIN
// ==========================================

export interface LoginRequest {
  email: string;

  password: string;
}


// ==========================================
// LOGIN RESPONSE
// ==========================================

export interface LoginResponse {
  accessToken: string;

  user: User;
}


// ==========================================
// SIGNUP
// ==========================================

export interface SignupRequest {
  fullName: string;

  username?: string;

  email: string;

  password: string;
}


// ==========================================
// SIGNUP RESPONSE
// ==========================================

export interface SignupResponse {
  accessToken: string;

  user: User;
}


// ==========================================
// AUTH RESPONSE
// ==========================================

export interface AuthResponse {
  accessToken: string;

  user: User;
}


// ==========================================
// MESSAGE RESPONSE
// ==========================================

export interface MessageResponse {
  message: string;
}