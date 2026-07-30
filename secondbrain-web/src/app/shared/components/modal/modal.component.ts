import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {

  title = input.required<string>();

  open = input(false);

  close = output<void>();

  onBackdropClick() {
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}