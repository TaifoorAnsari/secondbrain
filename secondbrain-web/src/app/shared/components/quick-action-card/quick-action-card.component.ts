import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-action-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quick-action-card.component.html',
  styleUrl: './quick-action-card.component.scss'
})
export class QuickActionCardComponent {
  router = inject(Router)

  title = input.required<string>();

  description = input.required<string>();

  icon = input.required<string>();

  route = input.required<string>();

  color = input('#6366F1');

  action = input.required<string>();

    onClick(): void {

    if (!this.route) {
      return;
    }

    this.router.navigate(
      [this.route()],
      {
        queryParams: {
          action: this.action()
        }
      }
    );

  }

}