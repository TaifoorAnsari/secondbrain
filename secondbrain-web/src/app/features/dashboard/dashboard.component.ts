import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResponse } from '../../core/models/dashboard.model';

import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { QuickActionCardComponent } from '../../shared/components/quick-action-card/quick-action-card.component';
import { RecentNotesComponent } from '../../shared/components/recent-notes/recent-notes.component';
import { ActivityTimelineComponent } from '../../shared/components/activity-timeline/activity-timeline.component';
import { UpcomingEventsComponent } from '../../shared/components/upcoming-events/upcoming-events.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    QuickActionCardComponent,
    RecentNotesComponent,
    ActivityTimelineComponent,
    UpcomingEventsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);

  currentUser = this.authService.currentUser;

  dashboard = signal<DashboardResponse | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading.set(true);

    this.dashboardService.getDashboard().subscribe({
      next: (response) => {
        this.dashboard.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.isLoading.set(false);
      }
    });
  }

  greeting = computed(() => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';

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
        value: 0,
        icon: 'event',
        subtitle: 'Coming Soon',
        color: '#F59E0B'
      }
    ];
  });

  quickActions = [
    {
      title: 'New Note',
      description: 'Capture an idea instantly',
      icon: 'edit_note',
      route: '/notes/new',
      color: '#6366F1'
    },
    {
      title: 'New Entity',
      description: 'Create a person or company',
      icon: 'account_tree',
      route: '/entities/new',
      color: '#06B6D4'
    },
    {
      title: 'Add Event',
      description: 'Schedule something important',
      icon: 'event',
      route: '/calendar/new',
      color: '#F59E0B'
    },
    {
      title: 'Write Diary',
      description: 'Reflect on your day',
      icon: 'menu_book',
      route: '/diary/new',
      color: '#10B981'
    }
  ];

  recentNotes = computed(() => {
    return (
      this.dashboard()?.recentNotes.map(note => ({
        id: note.id,
        title: note.title,
        preview: note.content.length > 70
            ? note.content.substring(0, 70) + '...'
            : note.content,
        updatedAt: new Date(note.updatedAt).toLocaleDateString()
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

  events = [
    {
      id: '1',
      title: 'Angular Interview',
      date: 'Tomorrow • 10:00 AM'
    },
    {
      id: '2',
      title: 'Team Meeting',
      date: 'Friday • 3:00 PM'
    },
    {
      id: '3',
      title: 'Doctor Appointment',
      date: 'Saturday • 6:30 PM'
    }
  ];
}