import { Component, input } from '@angular/core';

export interface RecentNote {

  id: string;

  title: string;

  preview: string;

  updatedAt: string;

}

@Component({
  selector: 'app-recent-notes',
  standalone: true,
  imports: [],
  templateUrl: './recent-notes.component.html',
  styleUrl: './recent-notes.component.scss'
})
export class RecentNotesComponent {

  notes = input.required<RecentNote[]>();

}