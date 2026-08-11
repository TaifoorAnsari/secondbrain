import {
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink,
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import { DiaryService } from '../../../core/services/diary.service';

import {
  DiaryEntry,
} from '../../../core/models/diary.model';


@Component({
  selector: 'app-diary-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
  ],

  templateUrl: './diary-list.component.html',

  styleUrl: './diary-list.component.scss',
})
export class DiaryListComponent
  implements OnInit {


  // ==========================================
  // SERVICES
  // ==========================================

  private readonly diaryService =
    inject(DiaryService);

  private readonly router =
    inject(Router);


  // ==========================================
  // FILTER STATE
  // ==========================================

  searchText = '';

  sortOption:
    'newest' | 'oldest' =
    'newest';

  fromDate = '';

  toDate = '';


  // ==========================================
  // MENU
  // ==========================================

  openMenuId:
    string | null = null;


  // ==========================================
  // DIARIES
  // ==========================================

  allDiaries =
    signal<DiaryEntry[]>([]);

  filteredDiaries =
    signal<DiaryEntry[]>([]);


  // ==========================================
  // LOADING
  // ==========================================

  isLoading =
    signal(false);


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadDiaries();

  }


  // ==========================================
  // LOAD DIARIES
  // ==========================================

  loadDiaries(): void {

    this.isLoading.set(true);


    this.diaryService
      .getDiaryEntries()
      .subscribe({

        next: (diaries) => {

          this.allDiaries.set(
            diaries,
          );

          this.applyFilters();

          this.isLoading.set(false);

        },

        error: (error) => {

          console.error(
            'Failed to load diary entries:',
            error,
          );

          this.isLoading.set(false);

        },

      });

  }


  // ==========================================
  // FILTERS
  // ==========================================

  applyFilters(): void {

    let diaries =
      [
        ...this.allDiaries(),
      ];


    // ========================================
    // SEARCH
    // ========================================

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    if (search) {

      diaries =
        diaries.filter(
          diary => {

            const title =
              diary.title
                .toLowerCase();

            const content =
              diary.content
                .toLowerCase();

            return (
              title.includes(search) ||
              content.includes(search)
            );

          },
        );

    }


    // ========================================
    // FROM DATE
    // ========================================

    if (this.fromDate) {

      diaries =
        diaries.filter(
          diary => {

            const date =
              diary.entryDate
                .substring(0, 10);

            return date >=
              this.fromDate;

          },
        );

    }


    // ========================================
    // TO DATE
    // ========================================

    if (this.toDate) {

      diaries =
        diaries.filter(
          diary => {

            const date =
              diary.entryDate
                .substring(0, 10);

            return date <=
              this.toDate;

          },
        );

    }


    // ========================================
    // SORT
    // ========================================

    diaries.sort(
      (a, b) => {

        const dateA =
          new Date(
            a.entryDate,
          ).getTime();

        const dateB =
          new Date(
            b.entryDate,
          ).getTime();


        if (
          this.sortOption ===
          'newest'
        ) {

          return dateB - dateA;

        }


        return dateA - dateB;

      },
    );


    this.filteredDiaries.set(
      diaries,
    );

  }


  // ==========================================
  // SEARCH
  // ==========================================

  onSearch(
    value: string,
  ): void {

    this.searchText =
      value;

    this.applyFilters();

  }


  // ==========================================
  // SORT
  // ==========================================

  onSortChange(
    value: string,
  ): void {

    this.sortOption =
      value as
        | 'newest'
        | 'oldest';

    this.applyFilters();

  }


  // ==========================================
  // FROM DATE
  // ==========================================

  onFromDateChange(
    value: string,
  ): void {

    this.fromDate =
      value;

    this.applyFilters();

  }


  // ==========================================
  // TO DATE
  // ==========================================

  onToDateChange(
    value: string,
  ): void {

    this.toDate =
      value;

    this.applyFilters();

  }


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  clearFilters(): void {

    this.searchText = '';

    this.sortOption =
      'newest';

    this.fromDate = '';

    this.toDate = '';

    this.applyFilters();

  }


  // ==========================================
  // MENU
  // ==========================================

  toggleMenu(
    id: string,
  ): void {

    this.openMenuId =
      this.openMenuId === id
        ? null
        : id;

  }


  // ==========================================
  // CLOSE MENU
  // ==========================================

  closeMenu(): void {

    this.openMenuId =
      null;

  }


  // ==========================================
  // DELETE
  // ==========================================

  deleteDiary(
    id: string,
  ): void {

    const diary =
      this.allDiaries()
        .find(
          item =>
            item.id === id,
        );


    if (!diary) {

      return;

    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${diary.title}"?`,
      );


    if (!confirmed) {

      return;

    }


    this.diaryService
      .deleteDiaryEntry(id)
      .subscribe({

        next: () => {

          this.openMenuId =
            null;

          this.loadDiaries();

        },

        error: (error) => {

          console.error(
            'Failed to delete diary entry:',
            error,
          );

        },

      });

  }


  // ==========================================
  // EDIT
  // ==========================================

  editDiary(
    id: string,
  ): void {

    this.openMenuId =
      null;

    this.router.navigate([
      '/diary/edit',
      id,
    ]);

  }


  // ==========================================
  // OPEN DIARY
  // ==========================================

  openDiary(
    id: string,
  ): void {

    this.router.navigate([
      '/diary',
      id,
    ]);

  }

}