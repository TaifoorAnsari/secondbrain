import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { DiaryService } from '../../../core/services/diary.service';
import { Diary } from '../../../core/models/diary.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-diary-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './diary-list.component.html',
  styleUrl: './diary-list.component.scss'
})
export class DiaryListComponent {
  searchText = '';

  sortOption = 'newest';

  fromDate = '';

  toDate = '';
  openMenuId: string | null = null;
  private diaryService = inject(DiaryService);
  private router = inject(Router);

  allDiaries = signal<Diary[]>([]);
  filteredDiaries = signal<Diary[]>([]);
  applyFilters() {

    let diaries = [...this.allDiaries()];

    // Search
    if (this.searchText.trim()) {

      const search = this.searchText.toLowerCase();

      diaries = diaries.filter(d =>
        d.title.toLowerCase().includes(search) ||
        d.content.toLowerCase().includes(search)
      );

    }

    // Date Range
    if (this.fromDate) {

      diaries = diaries.filter(d => d.date >= this.fromDate);

    }

    if (this.toDate) {

      diaries = diaries.filter(d => d.date <= this.toDate);

    }

    // Sorting
    diaries.sort((a, b) => {

      if (this.sortOption === 'newest') {

        return b.date.localeCompare(a.date);

      }

      return a.date.localeCompare(b.date);

    });

    this.filteredDiaries.set(diaries);

  }
  ngOnInit() {
    this.loadDiaries();
  }

  loadDiaries() {

    const diaries = this.diaryService.getAllDiaries();

    this.allDiaries.set(diaries);

    this.applyFilters();

  }
  clearFilters() {

    this.searchText = '';

    this.sortOption = 'newest';

    this.fromDate = '';

    this.toDate = '';

    this.applyFilters();

  }
  toggleMenu(id: string) {
    this.openMenuId =
      this.openMenuId === id ? null : id;
  }

  deleteDiary(id: string) {

    const confirmDelete = confirm(
      'Are you sure you want to delete this diary entry?'
    );

    if (!confirmDelete) return;

    this.diaryService.deleteDiary(id);

    this.loadDiaries();
  }

  editDiary(id: string) {
    this.router.navigate(['/diary/edit', id]);
  }

}