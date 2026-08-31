import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-action-card',
  standalone: true,
  imports: [],
  templateUrl: './quick-action-card.component.html',
  styleUrl: './quick-action-card.component.scss'
})
export class QuickActionCardComponent {

  private router = inject(Router);

  // ==========================================
  // INPUTS
  // ==========================================

  title = input.required<string>();

  description = input.required<string>();

  icon = input.required<string>();

  route = input.required<string>();

  color = input<string>('#6366F1');

  action = input<string>('');


  // ==========================================
  // CLICK
  // ==========================================

  onClick(): void {

    const route = this.route();

    if (!route) {
      return;
    }

    const action = this.action();

    // ----------------------------------------
    // If an action exists, send it as query param
    // ----------------------------------------

    if (action) {

      this.router.navigate(
        [route],
        {
          queryParams: {
            action
          }
        }
      );

      return;
    }


    // ----------------------------------------
    // Normal navigation
    // ----------------------------------------

    this.router.navigate([route]);

  }

}