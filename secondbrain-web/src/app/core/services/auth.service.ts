import {
  Injectable,
  inject,
  signal,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Observable,
  tap,
} from 'rxjs';

import {
  AuthResponse,
  MessageResponse,
  User,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '../models/auth.model';

export interface UpdateProfileData {
  fullName: string;
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

import {
  environment,
} from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    environment.apiUrl;


  // ==========================================
  // CURRENT USER
  // ==========================================

  readonly currentUser =
    signal<User | null>(null);


  // ==========================================
  // AUTH STATE
  // ==========================================

  readonly isAuthenticated =
    signal(false);


  // ==========================================
  // SIGNUP
  // ==========================================

  signup(
    data: SignupRequest,
  ) {

    return this.http
      .post<SignupResponse>(
        `${this.apiUrl}/auth/signup`,
        data,
      )
      .pipe(

        tap((response) => {

          localStorage.setItem(
            'accessToken',
            response.accessToken,
          );

          this.currentUser.set(
            response.user,
          );

          this.isAuthenticated.set(
            true,
          );

        }),

      );

  }


  // ==========================================
  // LOGIN
  // ==========================================

  login(
    data: LoginRequest,
  ) {

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/auth/login`,
        data,
      )
      .pipe(

        tap((response) => {

          localStorage.setItem(
            'accessToken',
            response.accessToken,
          );

          this.currentUser.set(
            response.user,
          );

          this.isAuthenticated.set(
            true,
          );

        }),

      );

  }


  // ==========================================
  // GET PROFILE
  // ==========================================

  getProfile() {

    return this.http
      .get<User>(
        `${this.apiUrl}/auth/profile`,
      );

  }


  // ==========================================
  // CHECK AUTH
  // ==========================================

  checkAuth(): void {

    const token =
      localStorage.getItem(
        'accessToken',
      );


    if (!token) {

      return;

    }


    this.getProfile()
      .subscribe({

        next: (user) => {

          this.currentUser.set(
            user,
          );

          this.isAuthenticated.set(
            true,
          );

        },

        error: () => {

          this.logout();

        },

      });

  }


  // ==========================================
  // UPDATE PROFILE
  // ==========================================

updateProfile(data: {
  fullName: string;
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}) {
  return this.http
    .patch<{
      message: string;
      user: User;
    }>(
      `${this.apiUrl}/auth/profile`,
      data,
    )
    .pipe(
      tap((response) => {
        this.currentUser.set(
          response.user
        );
      }),
    );
}

  // ==========================================
  // UPLOAD PROFILE AVATAR
  // ==========================================

  uploadAvatar(
    userId: string,
    file: File,
  ) {

    const formData =
      new FormData();


    formData.append(
      'avatar',
      file,
    );


    return this.http
      .post<User>(
        `${this.apiUrl}/users/${userId}/avatar`,
        formData,
      )
      .pipe(

        tap((updatedUser) => {

          this.currentUser.set(
            updatedUser,
          );

        }),

      );

  }


  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  changePassword(
    data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
  ) {

    return this.http.patch(
      `${this.apiUrl}/auth/change-password`,
      data,
    );

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem(
      'accessToken',
    );

    this.currentUser.set(
      null,
    );

    this.isAuthenticated.set(
      false,
    );

  }

}