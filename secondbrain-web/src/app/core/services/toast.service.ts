import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  toasts = signal<Toast[]>([]);

  private id = 0;

  show(message: string, type: ToastType = 'info') {

    const toast: Toast = {
      id: ++this.id,
      message,
      type,
    };

    this.toasts.update(t => [...t, toast]);

    setTimeout(() => {
      this.remove(toast.id);
    }, 3000);

  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  remove(id: number) {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }

}