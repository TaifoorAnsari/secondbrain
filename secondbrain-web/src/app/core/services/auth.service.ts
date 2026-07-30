import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, MessageResponse, User } from '../models/auth.model';

import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal(false);

signup(data: SignupRequest) {
  return this.http
    .post<SignupResponse>(`${this.apiUrl}/auth/signup`, data)
    .pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);

        this.currentUser.set(response.user);
        console.log(this.currentUser(),"current user")

        this.isAuthenticated.set(true);
      })
    );
}

login(data: LoginRequest) {
  return this.http
    .post<LoginResponse>(`${this.apiUrl}/auth/login`, data)
    .pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);

        this.currentUser.set(response.user);
        console.log(this.currentUser(),"current user login")
        this.isAuthenticated.set(true);
      })
    );
}

  getProfile() {
  return this.http.get<User>(`${this.apiUrl}/auth/profile`);
}

logout() {
  localStorage.removeItem('accessToken');
  this.currentUser.set(null);
  this.isAuthenticated.set(false);
}

checkAuth() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return;
  }

  this.getProfile().subscribe({
    next: (user) => {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    },
    error: () => {
      this.logout();
    },
  });
}

updateProfile(fullName: string) {
  return this.http
    .patch<AuthResponse>(`${this.apiUrl}/auth/profile`, {
      fullName,
    })
    .pipe(
      tap((response) => {
        this.currentUser.set(response.user);
      })
    );
}

changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return this.http.patch<MessageResponse>(
    `${this.apiUrl}/auth/change-password`,
    data
  );
}
}