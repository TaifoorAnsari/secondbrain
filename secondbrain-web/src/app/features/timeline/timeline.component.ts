import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {

  private authService = inject(AuthService);

  ngOnInit() {
  this.authService.getProfile().subscribe({
    next: (user) => {
      console.log('Logged-in User:', user);
    },
    error: (err) => {
      console.error(err);
    },
  });
}
  timeline = [
    {
      title: 'Meeting with Rahul',
      type: 'meeting',
      icon: '👤',
      label: 'Meeting',
      datetime: 'Today • 09:30 AM',
      description: 'Met Rahul while purchasing groceries. Rahul informed me about a Townhall interview scheduled for Monday where I need to interview 50 students.',
      tags: ['Meeting', 'Work', 'Important']
    },
    {
      title: 'Townhall Interview',
      type: 'event',
      icon: '📅',
      label: 'Event',
      datetime: 'Tomorrow • 10:00 AM',
      description: 'Reminder created for Interview of 50 students. Notification scheduled for Morning and Night.',
      tags: ['Reminder', 'Interview']
    },
    {
      title: 'Narendra Modi Notes',
      type: 'note',
      icon: '📝',
      label: 'Note',
      datetime: '15 Aug 2020',
      description: 'Added speech regarding "Acche Din" with complete description and references.',
      tags: ['Politics', 'Speech', 'Notes']
    },
    {
      title: 'ABC Technologies',
      type: 'company',
      icon: '🏢',
      label: 'Company',
      datetime: '20 July 2026',
      description: 'Company profile created with website, contacts and meeting history.',
      tags: ['Company', 'Business']
    },
    {
      title: 'Diary Entry',
      type: 'diary',
      icon: '📖',
      label: 'Diary',
      datetime: 'Yesterday • 08:45 PM',
      description: 'Today was productive. Completed Second Mind Dashboard, backend planning and authentication.',
      tags: ['Diary', 'Personal']
    }
  ];
}
