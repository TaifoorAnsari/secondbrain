import { Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private toast = inject(ToastService)

  currentUser = this.authService.currentUser;

  user = {
    fullName: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
  };

  private originalUser = {
    fullName: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
  };

  appearance = {
    theme: 'light',
    accentColor: 'purple',
  };

  notifications = {
    morning: true,
    evening: true,
    email: false,
    browser: true,
  };

  avatarPreview: string | null = null;

  photoError = '';

  isEditing = false;

  isSaving = false;
saveSuccess: any;
saveError: any;

ngOnInit(): void {
  this.loadUser();
  this.loadAppearance();
}

  private loadUser(): void {
    const loggedInUser = this.currentUser();

    if (loggedInUser) {
      this.populateUser(loggedInUser);
      return;
    }

    this.authService.getProfile().subscribe({
      next: (user) => {
        this.authService.currentUser.set(user);
        this.populateUser(user);
      },

      error: (error) => {
        console.error('Failed to load profile:', error);
      },
    });
  }

  private populateUser(user: any): void {
    this.user = {
      fullName: user.fullName ?? '',
      username: user.username ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      bio: user.bio ?? '',
    };

    this.originalUser = {
      fullName: this.user.fullName,
      username: this.user.username,
      email: this.user.email,
      phone: this.user.phone,
      bio: this.user.bio,
    };

    this.avatarPreview = this.getAvatarUrl(user.avatar);
  }

  get avatarLetter(): string {
    return this.user.fullName?.charAt(0).toUpperCase() || 'U';
  }

  onPhotoSelected(event: Event): void {
    this.photoError = '';

    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.photoError = 'Please select a PNG, JPG or WebP image.';

      input.value = '';

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      this.photoError = 'Profile photo must be smaller than 5 MB.';

      input.value = '';

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };

    reader.readAsDataURL(file);

    const loggedInUser = this.currentUser();

    if (!loggedInUser?.id) {
      this.photoError = 'User information is not available.';

      return;
    }

    this.authService.uploadAvatar(loggedInUser.id, file).subscribe({
      next: (updatedUser) => {
        this.authService.currentUser.set(updatedUser);

        this.populateUser(updatedUser);

        this.toast.success('Avatar updated successfully');
      },

      error: (error) => {
        console.error('Avatar upload failed:', error);

        this.photoError =
          error?.error?.message || 'Failed to upload profile photo.';
      },
    });

    input.value = '';
  }

  saveSettings(): void {
    if (!this.isEditing) {
      this.isEditing = true;

      return;
    }

    const hasChanges =
      this.user.fullName !== this.originalUser.fullName ||
      this.user.username !== this.originalUser.username ||
      this.user.phone !== this.originalUser.phone ||
      this.user.bio !== this.originalUser.bio;

    if (!hasChanges) {
      this.isEditing = false;

      return;
    }

    this.isSaving = true;


    this.authService
      .updateProfile({
        fullName: this.user.fullName,

        username: this.user.username,

        email: this.originalUser.email,

        phone: this.user.phone,

        bio: this.user.bio,
      })
      .subscribe({
        next: (response) => {
          this.isSaving = false;

          this.authService.currentUser.set(response.user);

          this.populateUser(response.user);

          this.isEditing = false;
          this.toast.success('Your changes have been saved.');
        },

        error: (error) => {
          this.isSaving = false;

          console.error('Profile update failed:', error);

          this.toast.error( error?.error?.message || 'Failed to update profile.');
        },
      });
  }

  exportJson(): void {
    const data = {
      user: this.user,
      appearance: this.appearance,
      notifications: this.notifications,
    };

    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = 'birbal-data.json';

    link.click();

    URL.revokeObjectURL(url);
  }

  exportPdf(): void {
    console.log('PDF export will be implemented next.');
  }

  importData(): void {
    console.log('Import data clicked.');
  }

  deleteAccount(): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    console.log('Delete account requested.');
  }

  private getAvatarUrl(avatar: string | null): string | null {
  if (!avatar) {
    return null;
  }
  if (
    avatar.startsWith('http://') ||
    avatar.startsWith('https://') ||
    avatar.startsWith('data:')
  ) {
    return avatar;
  }
  return `${environment.apiUrl}${avatar}`;
}

private loadAppearance(): void {
  const savedTheme = localStorage.getItem('birbal-theme');
  const savedAccent = localStorage.getItem('birbal-accent');

  if (savedTheme) {
    this.appearance.theme = savedTheme;
  }

  if (savedAccent) {
    this.appearance.accentColor = savedAccent;
  }

  this.applyTheme();
  this.applyAccentColor();
}

changeTheme(theme: string): void {
  this.appearance.theme = theme;

  localStorage.setItem(
    'birbal-theme',
    theme
  );

  this.applyTheme();
}

changeAccentColor(color: string): void {
  this.appearance.accentColor = color;

  localStorage.setItem(
    'birbal-accent',
    color
  );

  this.applyAccentColor();
}

private applyTheme(): void {
  const root = document.documentElement;

  root.classList.remove(
    'theme-light',
    'theme-dark'
  );

  if (this.appearance.theme === 'dark') {
    root.classList.add('theme-dark');
    return;
  }

  if (this.appearance.theme === 'light') {
    root.classList.add('theme-light');
    return;
  }

  const prefersDark =
    window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

  root.classList.add(
    prefersDark
      ? 'theme-dark'
      : 'theme-light'
  );
}

private applyAccentColor(): void {
  const colors: Record<string, string> = {
    blue: '#2563eb',
    purple: '#7c3aed',
    green: '#10b981',
    orange: '#f97316'
  };

  const color =
    colors[this.appearance.accentColor]
    ?? colors['purple'];

  document.documentElement.style.setProperty(
    '--accent-color',
    color
  );
}
}
