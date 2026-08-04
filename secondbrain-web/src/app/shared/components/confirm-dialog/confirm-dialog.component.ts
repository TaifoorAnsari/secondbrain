import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  confirmService = inject(ConfirmDialogService);

  confirm(): void {
    this.confirmService.confirmAction();
  }

  cancel(): void {
    this.confirmService.cancelAction();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.confirmService.dialog()) {
      this.cancel();
    }
  }
}
