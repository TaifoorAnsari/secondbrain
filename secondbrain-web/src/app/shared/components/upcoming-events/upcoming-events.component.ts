import { SlicePipe } from '@angular/common';
import { Component, computed, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface UpcomingEvent {

  id: string;

  title: string;

  date: string;

}

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './upcoming-events.component.html',
  styleUrl: './upcoming-events.component.scss'
})
export class UpcomingEventsComponent {

  events = input.required<UpcomingEvent[]>();

}