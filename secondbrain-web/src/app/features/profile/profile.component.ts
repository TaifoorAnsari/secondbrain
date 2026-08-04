import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';
import { NotesService } from '../../core/services/notes.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { Note } from '../../core/models/note.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule, ModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private notesService = inject(NotesService);
  private fb = inject(FormBuilder);

  user = this.authService.currentUser;

  showEditProfile = signal(false);
  showChangePassword = signal(false);

  isChangingPassword = signal(false);
  isLoading = signal(false);

  changePasswordError = signal('');

  notes = signal<number>(0);

  avatarLetter = computed(() => {
    const fullName = this.user()?.fullName;

    if (!fullName) {
      return 'U';
    }

    return fullName.charAt(0).toUpperCase();
  });

  editProfileForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
  });

  changePasswordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.loadNotes();
  }

  openEditProfile() {
    this.editProfileForm.patchValue({
      fullName: this.user()?.fullName ?? '',
    });

    this.showEditProfile.set(true);
  }

  updateProfile() {
    if (this.editProfileForm.invalid) {
      this.editProfileForm.markAllAsTouched();
      return;
    }

    const fullName = this.editProfileForm.value.fullName!;

    this.authService.updateProfile(fullName).subscribe({
      next: () => {
        this.showEditProfile.set(false);
      },

      error: (err) => {
        console.error(err);
        alert('Failed to update profile.');
      },
    });
  }

  loadNotes(): void {

    this.notesService.getNotes().subscribe({
      next: (notes: Note[]) => {
        this.notes.set(notes.length);
        console.log(this.notes(), " 1112222222")
        this.isLoading.set(false);
      },

      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  openChangePassword() {
    this.changePasswordForm.reset();
    this.changePasswordError.set('');
    this.showChangePassword.set(true);
  }

  closeChangePassword() {
    this.showChangePassword.set(false);
    this.changePasswordForm.reset();
    this.changePasswordError.set('');
  }

  changePassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } =
      this.changePasswordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.changePasswordError.set('New passwords do not match');
      return;
    }

    this.isChangingPassword.set(true);
    this.changePasswordError.set('');

    this.authService
      .changePassword({
        currentPassword: currentPassword!,
        newPassword: newPassword!,
        confirmPassword: confirmPassword!,
      })
      .subscribe({
        next: (response) => {
          alert(response.message);

          this.closeChangePassword();

          this.isChangingPassword.set(false);
        },

        error: (err) => {
          this.changePasswordError.set(
            err.error?.message || 'Something went wrong',
          );

          this.isChangingPassword.set(false);
        },
      });
  }

  goBack() {
    window.history.back();
  }
}
