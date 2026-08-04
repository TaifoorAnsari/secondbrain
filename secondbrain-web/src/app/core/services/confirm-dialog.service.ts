import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  dialog = signal<ConfirmDialogData | null>(null);

  private resolver?: (value: boolean) => void;

  confirm(data: ConfirmDialogData): Promise<boolean> {
    this.dialog.set(data);

    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  confirmAction(): void {
    this.dialog.set(null);

    this.resolver?.(true);
  }

  cancelAction(): void {
    this.dialog.set(null);

    this.resolver?.(false);
  }
}
