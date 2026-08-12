import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DiaryService } from '../../core/services/diary.service';

import {
  CreateDiaryDto,
  DiaryEntry,
  DiaryMood,
} from '../../core/models/diary.model';


@Component({
  selector: 'app-diary',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],

  templateUrl: './diary.component.html',

  styleUrls: [
    './diary.component.scss',
  ],
})
export class DiaryComponent implements OnInit {

  // ==========================================
  // SERVICES
  // ==========================================

  private diaryService = inject(DiaryService);

  private fb = inject(FormBuilder);


  // ==========================================
  // STATE
  // ==========================================

  entries = signal<DiaryEntry[]>([]);

  isLoading = signal(false);

  isSaving = signal(false);

  showModal = signal(false);

  selectedEntry = signal<DiaryEntry | null>(null);


  // ==========================================
  // FILTER STATE
  // ==========================================

  searchTerm = signal('');

  fromDate = signal('');

  toDate = signal('');

  sortOrder = signal<'newest' | 'oldest'>(
    'newest',
  );


  // ==========================================
  // MOODS
  // ==========================================

  moods: DiaryMood[] = [
    'HAPPY',
    'SAD',
    'EXCITED',
    'CALM',
    'ANGRY',
    'ANXIOUS',
    'GRATEFUL',
    'NEUTRAL',
  ];


  // ==========================================
  // FORM
  // ==========================================

  diaryForm = this.fb.nonNullable.group({

    title: [
      '',
      [
        Validators.required,
        Validators.maxLength(150),
      ],
    ],

    content: [
      '',
      [
        Validators.required,
        Validators.maxLength(10000),
      ],
    ],

    mood: [
      'NEUTRAL' as DiaryMood,
      Validators.required,
    ],

    entryDate: [
      '',
      Validators.required,
    ],

  });


  // ==========================================
  // EDIT MODE
  // ==========================================

  isEditMode = computed(() => {

    return this.selectedEntry() !== null;

  });


  // ==========================================
  // FILTERED ENTRIES
  // ==========================================

  filteredEntries = computed(() => {

    let result = [
      ...this.entries(),
    ];


    const search =
      this.searchTerm()
        .trim()
        .toLowerCase();

    const from =
      this.fromDate();

    const to =
      this.toDate();


    // ========================================
    // SEARCH
    // ========================================

    if (search) {

      result = result.filter(entry => {

        const title =
          entry.title
            .toLowerCase();

        const content =
          entry.content
            .toLowerCase();

        return (
          title.includes(search) ||
          content.includes(search)
        );

      });

    }


    // ========================================
    // FROM DATE
    // ========================================

    if (from) {

      result = result.filter(entry => {

        const date =
          entry.entryDate.substring(
            0,
            10,
          );

        return date >= from;

      });

    }


    // ========================================
    // TO DATE
    // ========================================

    if (to) {

      result = result.filter(entry => {

        const date =
          entry.entryDate.substring(
            0,
            10,
          );

        return date <= to;

      });

    }


    // ========================================
    // SORT
    // ========================================

    result.sort((a, b) => {

      const dateA =
        new Date(
          a.entryDate,
        ).getTime();

      const dateB =
        new Date(
          b.entryDate,
        ).getTime();


      if (
        this.sortOrder() === 'newest'
      ) {

        return dateB - dateA;

      }

      return dateA - dateB;

    });


    return result;

  });


  // ==========================================
  // ENTRY COUNT
  // ==========================================

  entryCount = computed(() => {

    return this.filteredEntries().length;

  });


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadEntries();

  }


  // ==========================================
  // LOAD ENTRIES
  // ==========================================

  loadEntries(): void {

    this.isLoading.set(true);


    this.diaryService
      .getDiaryEntries()
      .subscribe({

        next: entries => {

          this.entries.set(
            entries,
          );

          this.isLoading.set(
            false,
          );

        },

        error: error => {

          console.error(
            'Failed to load diary entries:',
            error,
          );

          this.isLoading.set(
            false,
          );

        },

      });

  }


  // ==========================================
  // SEARCH
  // ==========================================

  onSearch(
    event: Event,
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm.set(
      input.value,
    );

  }


  // ==========================================
  // FROM DATE
  // ==========================================

  onFromDate(
    event: Event,
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.fromDate.set(
      input.value,
    );

  }


  // ==========================================
  // TO DATE
  // ==========================================

  onToDate(
    event: Event,
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.toDate.set(
      input.value,
    );

  }


  // ==========================================
  // SORT
  // ==========================================

  changeSort(
    event: Event,
  ): void {

    const select =
      event.target as HTMLSelectElement;

    this.sortOrder.set(
      select.value as
        | 'newest'
        | 'oldest',
    );

  }


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  clearFilters(): void {

    this.searchTerm.set('');

    this.fromDate.set('');

    this.toDate.set('');

    this.sortOrder.set(
      'newest',
    );

  }


  // ==========================================
  // CREATE MODAL
  // ==========================================

  openCreateModal(): void {

    this.selectedEntry.set(
      null,
    );


    this.diaryForm.reset({

      title: '',

      content: '',

      mood: 'NEUTRAL',

      entryDate:
        this.getToday(),

    });


    this.showModal.set(
      true,
    );

  }


  // ==========================================
  // EDIT MODAL
  // ==========================================

  openEditModal(
    entry: DiaryEntry,
    event?: Event,
  ): void {

    event?.stopPropagation();


    this.selectedEntry.set(
      entry,
    );


    this.diaryForm.patchValue({

      title:
        entry.title,

      content:
        entry.content,

      mood:
        entry.mood,

      entryDate:
        entry.entryDate.substring(
          0,
          10,
        ),

    });


    this.showModal.set(
      true,
    );

  }


  // ==========================================
  // SAVE ENTRY
  // ==========================================

  saveEntry(): void {

    if (
      this.diaryForm.invalid
    ) {

      this.diaryForm.markAllAsTouched();

      return;

    }


    this.isSaving.set(
      true,
    );


    const dto =
      this.diaryForm.getRawValue();


    const selected =
      this.selectedEntry();


    // ========================================
    // UPDATE EXISTING ENTRY
    // ========================================

    if (selected) {

      this.diaryService
        .updateDiaryEntry(
          selected.id,
          dto,
        )
        .subscribe({

          next: () => {

            this.closeModal();

            this.loadEntries();

            this.isSaving.set(
              false,
            );

          },

          error: error => {

            console.error(
              'Failed to update diary entry:',
              error,
            );

            this.isSaving.set(
              false,
            );

          },

        });

      return;

    }


    // ========================================
    // CREATE NEW ENTRY
    // ========================================

    this.diaryService
      .createDiaryEntry(
        dto as CreateDiaryDto,
      )
      .subscribe({

        next: () => {

          this.closeModal();

          this.loadEntries();

          this.isSaving.set(
            false,
          );

        },

        error: error => {

          console.error(
            'Failed to create diary entry:',
            error,
          );

          this.isSaving.set(
            false,
          );

        },

      });

  }


  // ==========================================
  // DELETE ENTRY
  // ==========================================

  deleteEntry(
    entry: DiaryEntry,
    event?: Event,
  ): void {

    event?.stopPropagation();


    // Confirmation only.
    // No success alert.

    const confirmed =
      window.confirm(
        `Delete "${entry.title}"?`,
      );


    if (!confirmed) {

      return;

    }


    this.diaryService
      .deleteDiaryEntry(
        entry.id,
      )
      .subscribe({

        next: () => {

          // Remove immediately from UI
          this.entries.update(
            entries =>
              entries.filter(
                item =>
                  item.id !== entry.id,
              ),
          );

        },

        error: error => {

          console.error(
            'Failed to delete diary entry:',
            error,
          );

        },

      });

  }


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  closeModal(): void {

    this.showModal.set(
      false,
    );


    this.selectedEntry.set(
      null,
    );


    this.diaryForm.reset({

      title: '',

      content: '',

      mood: 'NEUTRAL',

      entryDate:
        this.getToday(),

    });

  }


  // ==========================================
  // TODAY
  // ==========================================

  private getToday(): string {

    const today =
      new Date();


    const year =
      today.getFullYear();


    const month =
      String(
        today.getMonth() + 1,
      ).padStart(
        2,
        '0',
      );


    const day =
      String(
        today.getDate(),
      ).padStart(
        2,
        '0',
      );


    return `${year}-${month}-${day}`;

  }

}