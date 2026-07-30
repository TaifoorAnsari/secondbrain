import { Component, input } from '@angular/core';

export interface Activity {
  id: string;

  icon: string;

  title: string;

  time: string;
}

@Component({
  selector: 'app-activity-timeline',
  standalone: true,
  imports: [],
  templateUrl: './activity-timeline.component.html',
  styleUrl: './activity-timeline.component.scss',
})
export class ActivityTimelineComponent {
  activities = input.required<Activity[]>();
}
