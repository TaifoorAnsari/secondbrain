import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';

import { NotesService } from '../../core/services/notes.service';

import { ModalComponent } from '../../shared/components/modal/modal.component';

import { Note } from '../../core/models/note.model';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [CommonModule, DatePipe, ReactiveFormsModule, ModalComponent],

  templateUrl: './profile.component.html',

  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
// ==========================================
openPhotoPicker(_t8: HTMLInputElement) {
throw new Error('Method not implemented.');
}
  // ==========================================
  // SERVICES
  // ==========================================

  private readonly authService = inject(AuthService);

  private readonly notesService = inject(NotesService);

  private readonly fb = inject(FormBuilder);

  // ==========================================
  // USER
  // ==========================================

  readonly user = this.authService.currentUser;

  // ==========================================
  // API URL
  // ==========================================

  readonly apiUrl = environment.apiUrl;

  // ==========================================
  // PROFILE STATE
  // ==========================================

  readonly showEditProfile = signal(false);

  readonly showChangePassword = signal(false);

  // ==========================================
  // LOADING
  // ==========================================

  readonly isLoading = signal(false);

  readonly isChangingPassword = signal(false);

  readonly isUploadingAvatar = signal(false);

  // ==========================================
  // ERRORS
  // ==========================================

  readonly changePasswordError = signal('');

  readonly avatarError = signal('');

  // ==========================================
  // NOTES
  // ==========================================

  readonly notes = signal(0);

  // ==========================================
  // AVATAR LETTER
  // ==========================================

  readonly avatarLetter = computed(() => {
    const fullName = this.user()?.fullName;

    if (!fullName) {
      return 'U';
    }

    return fullName.charAt(0).toUpperCase();
  });

  // ==========================================
  // AVATAR URL
  // ==========================================

  readonly avatarUrl = computed(() => {
    const avatar = this.user()?.avatar;

    if (!avatar) {
      return null;
    }

    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }

    return `${this.apiUrl}${avatar}`;
  });

  // ==========================================
  // EDIT PROFILE FORM
  // ==========================================

  readonly editProfileForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
  });

  // ==========================================
  // CHANGE PASSWORD FORM
  // ==========================================

  readonly changePasswordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],

    newPassword: ['', [Validators.required, Validators.minLength(8)]],

    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadNotes();
  }

  // ==========================================
  // PROFILE PHOTO
  // ==========================================

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Clear previous error

    this.avatarError.set('');

    // Validate file type

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.avatarError.set('Only JPG, PNG and WEBP images are allowed.');

      input.value = '';

      return;
    }

    // Validate file size

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      this.avatarError.set('Profile photo must be smaller than 5MB.');

      input.value = '';

      return;
    }

    // Get current user

    const currentUser = this.user();

    if (!currentUser?.id) {
      this.avatarError.set('User information is not available.');

      input.value = '';

      return;
    }

    // Start upload

    this.isUploadingAvatar.set(true);

    this.authService.uploadAvatar(currentUser.id, file).subscribe({
      next: (updatedUser) => {
        this.authService.currentUser.set(updatedUser);

        this.isUploadingAvatar.set(false);

        input.value = '';
      },

      error: (error) => {
        console.error('Profile photo upload failed:', error);

        this.avatarError.set(
          error?.error?.message || 'Failed to upload profile photo.',
        );

        this.isUploadingAvatar.set(false);

        input.value = '';
      },
    });
  }

  // ==========================================
  // OPEN EDIT PROFILE
  // ==========================================

  openEditProfile(): void {
    this.editProfileForm.patchValue({
      fullName: this.user()?.fullName ?? '',
    });

    this.showEditProfile.set(true);
  }

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  // saveProfile(): void {
  //   if (this.editProfileForm.invalid) {
  //     this.editProfileForm.markAllAsTouched();

  //     return;
  //   }

  //   const fullName = this.editProfileForm.getRawValue().fullName;

  //   this.authService.updateProfile(fullName).subscribe({
  //     next: () => {
  //       this.showEditProfile.set(false);
  //     },

  //     error: (error) => {
  //       console.error('Failed to update profile:', error);
  //     },
  //   });
  // }

  // ==========================================
  // LOAD NOTES
  // ==========================================

  loadNotes(): void {
    this.isLoading.set(true);

    this.notesService.getNotes().subscribe({
      next: (notes: Note[]) => {
        this.notes.set(notes.length);

        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Failed to load notes:', error);

        this.isLoading.set(false);
      },
    });
  }

  // ==========================================
  // OPEN CHANGE PASSWORD
  // ==========================================

  openChangePassword(): void {
    this.changePasswordForm.reset();

    this.changePasswordError.set('');

    this.showChangePassword.set(true);
  }

  // ==========================================
  // CLOSE CHANGE PASSWORD
  // ==========================================

  closeChangePassword(): void {
    this.showChangePassword.set(false);

    this.changePasswordForm.reset();

    this.changePasswordError.set('');
  }

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  changePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();

      return;
    }

    const { currentPassword, newPassword, confirmPassword } =
      this.changePasswordForm.getRawValue();

    // Password confirmation

    if (newPassword !== confirmPassword) {
      this.changePasswordError.set('New passwords do not match.');

      return;
    }

    this.isChangingPassword.set(true);

    this.changePasswordError.set('');

    this.authService
      .changePassword({
        currentPassword,

        newPassword,

        confirmPassword,
      })
      .subscribe({
        next: () => {
          this.isChangingPassword.set(false);

          this.closeChangePassword();
        },

        error: (error) => {
          console.error('Failed to change password:', error);

          this.changePasswordError.set(
            error?.error?.message || 'Something went wrong.',
          );

          this.isChangingPassword.set(false);
        },
      });
  }

  // ==========================================
  // GO BACK
  // ==========================================

  goBack(): void {
    window.history.back();
  }
}
