import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-action-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quick-action-card.component.html',
  styleUrl: './quick-action-card.component.scss'
})
export class QuickActionCardComponent {

  title = input.required<string>();

  description = input.required<string>();

  icon = input.required<string>();

  route = input.required<string>();

  color = input('#6366F1');

}