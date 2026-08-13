import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { EntitiesService } from '../../core/services/entities.service';
import { Entity } from '../../core/models/entity.model';

import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { TimelineService } from '../../core/services/timeline.service';

import { DashboardResponse } from '../../core/models/dashboard.model';
import { Timeline } from '../../core/models/timeline.model';

import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { QuickActionCardComponent } from '../../shared/components/quick-action-card/quick-action-card.component';
import { RecentNotesComponent } from '../../shared/components/recent-notes/recent-notes.component';
import { ActivityTimelineComponent } from '../../shared/components/activity-timeline/activity-timeline.component';

import {
  UpcomingEventsComponent,
  UpcomingEvent
} from '../../shared/components/upcoming-events/upcoming-events.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    StatCardComponent,
    QuickActionCardComponent,
    RecentNotesComponent,
    ActivityTimelineComponent,
    UpcomingEventsComponent
  ],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private authService = inject(AuthService);

  private dashboardService = inject(DashboardService);

  private timelineService = inject(TimelineService);

  private entitiesService = inject(EntitiesService);

  private router = inject(Router);


  currentUser = this.authService.currentUser;


  dashboard = signal<DashboardResponse | null>(null);

  isLoading = signal(false);


  timelines = signal<Timeline[]>([]);


  mindQuery = '';

  entitySuggestions = signal<Entity[]>([]);

  showEntitySuggestions = signal(false);

  isSearchingEntities = signal(false);

  selectedEntity = signal<Entity | null>(null);


  ngOnInit(): void {

    this.loadDashboard();

    this.loadUpcomingEvents();

  }


  loadDashboard(): void {

    this.isLoading.set(true);

    this.dashboardService.getDashboard().subscribe({

      next: (response) => {

        this.dashboard.set(response);

        this.isLoading.set(false);

      },

      error: (error) => {

        console.error('Dashboard loading error:', error);

        this.isLoading.set(false);

      }

    });

  }


  loadUpcomingEvents(): void {

    this.timelineService.getTimelines().subscribe({

      next: (response) => {

        console.log('Timeline events:', response);

        this.timelines.set(response);

      },

      error: (error) => {

        console.error(
          'Failed to load timeline events:',
          error
        );

        this.timelines.set([]);

      }

    });

  }


onMindInput(): void {

  const value = this.mindQuery.trim();

  // If an entity is already selected,
  // this input is now for writing the thought.
  if (this.selectedEntity()) {
    return;
  }

  if (!value.startsWith('@')) {

    this.entitySuggestions.set([]);

    this.showEntitySuggestions.set(false);

    return;
  }

  const search = value.substring(1).trim();

  if (!search) {

    this.entitySuggestions.set([]);

    this.showEntitySuggestions.set(false);

    return;
  }

  this.showEntitySuggestions.set(true);

  this.isSearchingEntities.set(true);

  this.entitiesService.getEntities(search).subscribe({

    next: (entities) => {

      this.entitySuggestions.set(entities);

      this.isSearchingEntities.set(false);

    },

    error: (error) => {

      console.error('Entity search failed:', error);

      this.entitySuggestions.set([]);

      this.isSearchingEntities.set(false);

    }

  });

}

saveMindEntry(): void {

  const entity = this.selectedEntity();

  const description = this.mindQuery.trim();

  if (!entity || !description) {
    return;
  }

  const dto = {
    title: description.length > 60
      ? description.substring(0, 60) + '...'
      : description,

    description,

    eventDate: new Date().toISOString(),

    entityIds: [entity.id],

    showOnCalendar: false,
  };

  this.timelineService.createTimeline(dto).subscribe({

    next: (timeline) => {

      console.log('Timeline created:', timeline);

      this.mindQuery = '';

      this.selectedEntity.set(null);

      this.loadUpcomingEvents();

    },

    error: (error) => {

      console.error(
        'Failed to create timeline:',
        error
      );

    },

  });

}

selectEntity(entity: Entity): void {

  this.selectedEntity.set(entity);

  this.showEntitySuggestions.set(false);

  this.entitySuggestions.set([]);

  this.mindQuery = '';

}


  greeting = computed(() => {

    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good Morning';
    }

    if (hour < 17) {
      return 'Good Afternoon';
    }

    return 'Good Evening';

  });


  stats = computed(() => {

    const data = this.dashboard();

    return [

      {
        title: 'Notes',
        value: data?.stats.totalNotes ?? 0,
        icon: 'description',
        subtitle: 'Total Notes',
        color: '#6366F1'
      },

      {
        title: 'Pinned',
        value: data?.stats.pinnedNotes ?? 0,
        icon: 'push_pin',
        subtitle: 'Pinned Notes',
        color: '#EC4899'
      },

      {
        title: 'Categories',
        value: data?.stats.categories ?? 0,
        icon: 'category',
        subtitle: 'Categories',
        color: '#0EA5E9'
      },

      {
        title: 'Events',
        value: this.timelines().length,
        icon: 'event',
        subtitle: 'Calendar Events',
        color: '#F59E0B'
      }

    ];

  });


  upcomingEvents = computed<UpcomingEvent[]>(() => {

    const now = new Date();

    return this.timelines()

      .filter((event) => {

        const eventDate = new Date(event.eventDate);

        return eventDate >= now;

      })

      .sort((a, b) => {

        const dateA =
          new Date(a.eventDate).getTime();

        const dateB =
          new Date(b.eventDate).getTime();

        return dateA - dateB;

      })

      .map((event) => {

        const date =
          new Date(event.eventDate);

        return {

          id: event.id,

          title: event.title,

          date: this.formatEventDate(date)

        };

      });

  });


  private formatEventDate(date: Date): string {

    const today = new Date();

    const tomorrow = new Date();

    tomorrow.setDate(
      today.getDate() + 1
    );


    const eventDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const todayDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const tomorrowDay = new Date(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate()
    );


    let dayText: string;


    if (
      eventDay.getTime() ===
      todayDay.getTime()
    ) {

      dayText = 'Today';

    } else if (
      eventDay.getTime() ===
      tomorrowDay.getTime()
    ) {

      dayText = 'Tomorrow';

    } else {

      dayText =
        date.toLocaleDateString(
          'en-US',
          {
            weekday: 'long',
          }
        );

    }


    const timeText =
      date.toLocaleTimeString(
        'en-US',
        {
          hour: 'numeric',
          minute: '2-digit',
        }
      );


    return `${dayText} • ${timeText}`;

  }


  quickActions = [

    {
      title: 'New Note',
      description: 'Capture an idea instantly',
      icon: 'edit_note',
      route: '/notes',
      action: 'new',
      color: '#6366F1'
    },

    {
      title: 'New Entity',
      description: 'Create a person or company',
      icon: 'account_tree',
      route: '/entities',
      action: 'new',
      color: '#06B6D4'
    },

    {
      title: 'Add Event',
      description: 'Schedule something important',
      icon: 'event',
      route: '/timeline',
      action: 'new',
      color: '#F59E0B'
    },

    {
      title: 'Write Diary',
      description: 'Reflect on your day',
      icon: 'menu_book',
      route: '/diary',
      action: 'new',
      color: '#10B981'
    }

  ];


  recentNotes = computed(() => {

    return (

      this.dashboard()?.recentNotes.map(note => ({

        id: note.id,

        title: note.title,

        preview:
          note.content.length > 70
            ? note.content.substring(0, 70) + '...'
            : note.content,

        updatedAt:
          new Date(
            note.updatedAt
          ).toLocaleDateString()

      })) ?? []

    );

  });


  activities = [

    {
      id: '1',
      icon: 'login',
      title: 'Logged into SecondBrain',
      time: '2 minutes ago'
    },

    {
      id: '2',
      icon: 'description',
      title: 'Created Angular Signals note',
      time: '15 minutes ago'
    },

    {
      id: '3',
      icon: 'edit',
      title: 'Updated Diary',
      time: 'Yesterday'
    },

    {
      id: '4',
      icon: 'account_tree',
      title: 'Added Entity',
      time: '2 days ago'
    }

  ];

}