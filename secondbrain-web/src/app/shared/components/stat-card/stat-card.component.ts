import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  title = input.required<string>();
  value = input.required<number>();
  icon = input.required<string>();
  subtitle = input('');
  color = input('#4F46E5');
}