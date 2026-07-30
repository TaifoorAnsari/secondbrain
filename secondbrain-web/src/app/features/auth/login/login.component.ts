import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Brain, Mail, Lock,Eye, EyeOff, LucideAngularModule } from 'lucide-angular';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly Brain = Brain;
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  hidePassword = true;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

onSubmit() {
  this.loginForm.markAllAsTouched();

  if (this.loginForm.invalid) {
    return;
  }

  this.authService.login(this.loginForm.getRawValue()).subscribe({
    next: (response) => {
      console.log('Login Successful', response);

      localStorage.setItem('accessToken', response.accessToken);

      this.router.navigate(['/']);
    },

        error: (error) => {
      console.log('Full Error:', error);
    }
  });
}
}