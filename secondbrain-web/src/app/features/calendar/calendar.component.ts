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
export class CalendarComponent {

  constructor(
    private router: Router,
  ) {}
private timelineService = inject(
  TimelineService,
);

  currentMonth = 'August';

  currentYear = 2026;

  selectedDate = '06 Aug 2026';

calendarDays: CalendarDay[] = [];

timelines: Timeline[] = [];

  selectedEvents: CalendarEvent[] = [];

  upcomingEvents: CalendarEvent[] = [

    {
      id: '1',
      title: 'Project Kickoff',
      description: 'Kickoff meeting',
      eventDate: '2026-08-10',
    },

    {
      id: '2',
      title: 'Presentation',
      description: 'Office presentation',
      eventDate: '2026-08-15',
    },

  ];

 ngOnInit(): void {

  this.loadTimelines();

}
loadTimelines(): void {

  this.timelineService
    .getTimelines()
    .subscribe({

      next: timelines => {

        this.timelines = timelines;

        this.generateCalendar();

      },

      error: err => {

        console.error(err);

      },

    });

}

  generateCalendar(): void {

    this.calendarDays = [];

    for (let i = 1; i <= 35; i++) {

      this.calendarDays.push({

        date: i,

        fullDate: `${i} Aug 2026`,

        isToday: i === 6,

        events:

          i === 6
            ? [
                {
                  id: '1',
                  title: 'Presentation',
                  description: 'Birbal Presentation',
                  eventDate: '2026-08-06',
                },
                {
                  id: '2',
                  title: 'Office Meeting',
                  description: 'Sprint Planning',
                  eventDate: '2026-08-06',
                },
              ]

            : i === 11
            ? [
                {
                  id: '3',
                  title: 'Project Kickoff',
                  description: 'Project Start',
                  eventDate: '2026-08-11',
                },
              ]

            : [],

      });

    }

  }

  previousMonth(): void {

    console.log('Previous Month');

  }

  nextMonth(): void {

    console.log('Next Month');

  }

  openCreateTimeline(): void {

    this.router.navigate([
      '/timeline',
    ]);

  }

  selectDay(
    day: CalendarDay,
  ): void {

    this.selectedDate = day.fullDate;

    this.selectedEvents = day.events;

  }

  openTimeline(
    event: CalendarEvent,
  ): void {

    this.router.navigate([
      '/timeline',
      event.id,
    ]);

  }

}