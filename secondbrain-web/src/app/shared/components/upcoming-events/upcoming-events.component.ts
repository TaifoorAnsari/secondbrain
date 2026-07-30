import { Component, input } from '@angular/core';

export interface UpcomingEvent{

    id:string;

    title:string;

    date:string;

}

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [],
  templateUrl: './upcoming-events.component.html',
  styleUrl: './upcoming-events.component.scss'
})
export class UpcomingEventsComponent {

    events=input.required<UpcomingEvent[]>();

}