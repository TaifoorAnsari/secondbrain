import { Routes } from '@angular/router';

import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TimelineComponent } from './features/timeline/timeline.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { EntitiesComponent } from './features/entities/entities.component';
import { SettingsComponent } from './features/settings/settings.component';

import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';

import { NoteListComponent } from './features/notes/pages/notes-list/notes-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'timeline',
        component: TimelineComponent,
      },
      {
        path: 'calendar',
        component: CalendarComponent,
      },
      {
        path: 'entities',
        component: EntitiesComponent,
      },
      {
        path: 'entities/:id',
        loadComponent: () =>
          import(
            './features/entities/entity-profile/entity-profile.component'
          ).then((m) => m.EntityProfileComponent),
      },
      {
        path: 'notes',
        component: NoteListComponent,
      },
      {
  path: 'timeline',
  component: TimelineComponent,
},
{
  path: 'timeline/:id',
  loadComponent: () =>
    import('./features/timeline/timeline-detail/timeline-detail.component')
      .then(m => m.TimelineDetailComponent),
},
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
  path: 'timeline/:id/edit',
  loadComponent: () =>
    import('./features/timeline/edit-timeline/edit-timeline.component')
      .then(m => m.EditTimelineComponent),
},
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },
    ],
  },
];