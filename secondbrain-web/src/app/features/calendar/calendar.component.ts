import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {

  currentMonth = 'July';
  currentYear = 2026;

  calendarDays = Array.from({ length: 35 }, (_, i) => ({
    date: i + 1,
    isToday: i === 28,
    events:
      i === 28
        ? ['Interview', 'Meeting']
        : i === 14
        ? ['Townhall']
        : []
  }));

}