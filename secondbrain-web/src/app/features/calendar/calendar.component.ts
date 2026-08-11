import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TimelineService } from '../../core/services/timeline.service';
import { Timeline } from '../../core/models/timeline.model';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  eventDate: string;
}

interface CalendarDay {
  date: number;
  fullDate: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {

  private router = inject(Router);

  private timelineService = inject(
    TimelineService,
  );

  /*
  |--------------------------------------------------------------------------
  | Calendar State
  |--------------------------------------------------------------------------
  */

  currentMonth = 'August';

  currentYear = 2026;

  selectedDate = '2026-08-06';

  calendarDays: CalendarDay[] = [];

  timelines: Timeline[] = [];

  selectedEvents: CalendarEvent[] = [];

  /*
  |--------------------------------------------------------------------------
  | Lifecycle
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.loadTimelines();

  }

  /*
  |--------------------------------------------------------------------------
  | Load Timelines
  |--------------------------------------------------------------------------
  */

  loadTimelines(): void {

    this.timelineService
      .getTimelines()
      .subscribe({

        next: (timelines) => {

          this.timelines = timelines;

          this.generateCalendar();

          this.setSelectedEvents();

        },

        error: (err) => {

          console.error(
            'Failed to load timelines:',
            err,
          );

        },

      });

  }

  /*
  |--------------------------------------------------------------------------
  | Generate Calendar
  |--------------------------------------------------------------------------
  */

generateCalendar(): void {

  this.calendarDays = [];

  const monthIndex =
    this.getMonthIndex();

  // First day of current month
  const firstDay = new Date(
    this.currentYear,
    monthIndex,
    1,
  );

  // Last day of current month
  const lastDay = new Date(
    this.currentYear,
    monthIndex + 1,
    0,
  );

  const daysInMonth =
    lastDay.getDate();

  // 0 = Sunday
  // 1 = Monday
  // ...
  // 6 = Saturday

  const startingDay =
    firstDay.getDay();

  // Previous month's last date
  const previousMonthLastDay =
    new Date(
      this.currentYear,
      monthIndex,
      0,
    ).getDate();


  // ==========================================
  // PREVIOUS MONTH
  // ==========================================

  for (
    let i = startingDay - 1;
    i >= 0;
    i--
  ) {

    const date =
      previousMonthLastDay - i;

    const previousDate =
      new Date(
        this.currentYear,
        monthIndex - 1,
        date,
      );

    this.calendarDays.push(
      this.createCalendarDay(
        previousDate,
        false,
      ),
    );

  }


  // ==========================================
  // CURRENT MONTH
  // ==========================================

  for (
    let date = 1;
    date <= daysInMonth;
    date++
  ) {

    const currentDate =
      new Date(
        this.currentYear,
        monthIndex,
        date,
      );

    this.calendarDays.push(
      this.createCalendarDay(
        currentDate,
        true,
      ),
    );

  }


  // ==========================================
  // NEXT MONTH
  // ==========================================

  let nextDate = 1;

  while (
    this.calendarDays.length < 42
  ) {

    const nextMonthDate =
      new Date(
        this.currentYear,
        monthIndex + 1,
        nextDate,
      );

    this.calendarDays.push(
      this.createCalendarDay(
        nextMonthDate,
        false,
      ),
    );

    nextDate++;

  }


  // DEBUG
  console.log(
    'Calendar days:',
    this.calendarDays.length,
  );

}

  /*
  |--------------------------------------------------------------------------
  | Get Month Index
  |--------------------------------------------------------------------------
  */

  getMonthIndex(): number {

    const months = [

      'January',

      'February',

      'March',

      'April',

      'May',

      'June',

      'July',

      'August',

      'September',

      'October',

      'November',

      'December',

    ];

    return months.indexOf(
      this.currentMonth,
    );

  }

  /*
  |--------------------------------------------------------------------------
  | Create Calendar Day
  |--------------------------------------------------------------------------
  */

  createCalendarDay(
    date: Date,
    isCurrentMonth: boolean,
  ): CalendarDay {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1,
      ).padStart(2, '0');

    const day =
      String(
        date.getDate(),
      ).padStart(2, '0');

    const fullDate =
      `${year}-${month}-${day}`;

    /*
     * Check today's date
     */

    const today =
      new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    /*
     * Only show timelines that have
     * "Add to Calendar" enabled.
     */

    const events =
      this.timelines

        .filter((timeline) => {

          if (
            !timeline.showOnCalendar
          ) {

            return false;

          }

          const timelineDate =
            timeline.eventDate
              .substring(0, 10);

          return (
            timelineDate === fullDate
          );

        })

        .map((timeline) => {

          return {

            id: timeline.id,

            title: timeline.title,

            description:
              timeline.description,

            eventDate:
              timeline.eventDate,

          };

        });

    return {

      date:
        date.getDate(),

      fullDate,

      isToday,

      isCurrentMonth,

      events,

    };

  }

  /*
  |--------------------------------------------------------------------------
  | Previous Month
  |--------------------------------------------------------------------------
  */

  previousMonth(): void {

    const monthIndex =
      this.getMonthIndex();

    if (monthIndex === 0) {

      this.currentMonth =
        'December';

      this.currentYear--;

    } else {

      this.currentMonth =
        this.getMonthName(
          monthIndex - 1,
        );

    }

    this.generateCalendar();

    this.setSelectedEvents();

  }

  /*
  |--------------------------------------------------------------------------
  | Next Month
  |--------------------------------------------------------------------------
  */

nextMonth(): void {

  const monthIndex =
    this.getMonthIndex();

  if (monthIndex === 11) {

    this.currentMonth = 'January';

    this.currentYear++;

  } else {

    this.currentMonth =
      this.getMonthName(
        monthIndex + 1,
      );

  }

  this.selectedDate = this.formatDate(
    new Date(
      this.currentYear,
      this.getMonthIndex(),
      1,
    ),
  );

  this.generateCalendar();

  this.setSelectedEvents();

}
  /*
  |--------------------------------------------------------------------------
  | Get Month Name
  |--------------------------------------------------------------------------
  */

  getMonthName(
    monthIndex: number,
  ): string {

    const months = [

      'January',

      'February',

      'March',

      'April',

      'May',

      'June',

      'July',

      'August',

      'September',

      'October',

      'November',

      'December',

    ];

    return months[monthIndex];

  }

  /*
  |--------------------------------------------------------------------------
  | Today Button
  |--------------------------------------------------------------------------
  */

goToToday(): void {

  const today = new Date();

  this.currentYear =
    today.getFullYear();

  this.currentMonth =
    this.getMonthName(
      today.getMonth(),
    );

  this.selectedDate =
    this.formatDate(today);

  this.generateCalendar();

  this.setSelectedEvents();

}
  /*
  |--------------------------------------------------------------------------
  | Select Day
  |--------------------------------------------------------------------------
  */

  selectDay(
    day: CalendarDay,
  ): void {

    this.selectedDate =
      day.fullDate;

    this.selectedEvents =
      day.events;

  }

  /*
  |--------------------------------------------------------------------------
  | Set Selected Events
  |--------------------------------------------------------------------------
  */

  setSelectedEvents(): void {

    const selectedDay =
      this.calendarDays.find(
        day =>
          day.fullDate ===
          this.selectedDate,
      );

    this.selectedEvents =
      selectedDay?.events ?? [];

  }

  /*
  |--------------------------------------------------------------------------
  | Format Date
  |--------------------------------------------------------------------------
  */

  formatDate(
    date: Date,
  ): string {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1,
      ).padStart(2, '0');

    const day =
      String(
        date.getDate(),
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

  /*
  |--------------------------------------------------------------------------
  | Create Timeline
  |--------------------------------------------------------------------------
  */
 getUpcomingEvents(): CalendarEvent[] {

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0,
  );

  return this.timelines

    .filter(timeline => {

      if (!timeline.showOnCalendar) {
        return false;
      }

      const eventDate =
        new Date(
          timeline.eventDate,
        );

      return eventDate >= today;

    })

    .sort((a, b) => {

      return (
        new Date(a.eventDate).getTime()
        -
        new Date(b.eventDate).getTime()
      );

    })

    .slice(0, 5)

    .map(timeline => ({

      id: timeline.id,

      title: timeline.title,

      description:
        timeline.description,

      eventDate:
        timeline.eventDate,

    }));

}

getUpcomingLabel(eventDate: string): string {

  const event =
    new Date(eventDate);

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0,
  );

  const tomorrow =
    new Date(today);

  tomorrow.setDate(
    tomorrow.getDate() + 1,
  );

  const eventDay =
    new Date(event);

  eventDay.setHours(
    0,
    0,
    0,
    0,
  );

  // Today
  if (
    eventDay.getTime() ===
    today.getTime()
  ) {

    return 'Today';

  }

  // Tomorrow
  if (
    eventDay.getTime() ===
    tomorrow.getTime()
  ) {

    return 'Tomorrow';

  }

  // Other dates
  return event.toLocaleDateString(
    'en-US',
    {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    },
  );

}

  openCreateTimeline(): void {

    this.router.navigate([
      '/timeline',
    ]);

  }

  /*
  |--------------------------------------------------------------------------
  | Open Timeline
  |--------------------------------------------------------------------------
  */

  openTimeline(
    event: CalendarEvent,
  ): void {

    this.router.navigate([
      '/timeline',
      event.id,
    ]);

  }

}