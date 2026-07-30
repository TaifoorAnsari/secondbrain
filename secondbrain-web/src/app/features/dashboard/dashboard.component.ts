import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickActionCardComponent } from '../../shared/components/quick-action-card/quick-action-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { AuthService } from '../../core/services/auth.service';
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

  currentUser = this.authService.currentUser;

  greeting = computed(() => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';

    return 'Good Evening';
  });

  stats = [
    {
      title: 'Notes',
      value: 0,
      icon: 'description',
      subtitle: 'No notes yet',
      color: '#6366F1'
    },
    {
      title: 'Entities',
      value: 0,
      icon: 'account_tree',
      subtitle: 'No entities',
      color: '#0EA5E9'
    },
    {
      title: 'Events',
      value: 0,
      icon: 'event',
      subtitle: 'Nothing scheduled',
      color: '#F59E0B'
    },
    {
      title: 'Diary',
      value: 0,
      icon: 'menu_book',
      subtitle: 'Start journaling',
      color: '#10B981'
    }
  ];

  quickActions = [

{
title:'New Note',
description:'Capture an idea instantly',
icon:'edit_note',
route:'/notes/new',
color:'#6366F1'
},

{
title:'New Entity',
description:'Create a person or company',
icon:'account_tree',
route:'/entities/new',
color:'#06B6D4'
},

{
title:'Add Event',
description:'Schedule something important',
icon:'event',
route:'/calendar/new',
color:'#F59E0B'
},

{
title:'Write Diary',
description:'Reflect on your day',
icon:'menu_book',
route:'/diary/new',
color:'#10B981'
}

];

recentNotes = [

{
id:'1',
title:'Angular Signals',
preview:'Signals simplify state management and improve performance...',
updatedAt:'2 minutes ago'
},

{
id:'2',
title:'NestJS Authentication',
preview:'JWT authentication flow completed successfully...',
updatedAt:'Yesterday'
},

{
id:'3',
title:'ICT Trading Notes',
preview:'Quarterly theory and timed liquidity observations...',
updatedAt:'3 days ago'
}

];

activities = [

{
id:'1',
icon:'login',
title:'Logged into SecondBrain',
time:'2 minutes ago'
},

{
id:'2',
icon:'description',
title:'Created Angular Signals note',
time:'15 minutes ago'
},

{
id:'3',
icon:'edit',
title:'Updated Diary',
time:'Yesterday'
},

{
id:'4',
icon:'account_tree',
title:'Added Entity',
time:'2 days ago'
}

];

events = [

{
id:'1',
title:'Angular Interview',
date:'Tomorrow • 10:00 AM'
},

{
id:'2',
title:'Team Meeting',
date:'Friday • 3:00 PM'
},

{
id:'3',
title:'Doctor Appointment',
date:'Saturday • 6:30 PM'
}

];

}