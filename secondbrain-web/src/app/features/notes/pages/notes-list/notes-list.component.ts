import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { NotesService } from '../../../../core/services/notes.service';
import { Note } from '../../../../core/models/note.model';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.scss',
})
export class NoteListComponent implements OnInit {
  private notesService = inject(NotesService);
  private fb = inject(FormBuilder);

  notes = signal<Note[]>([]);
  isLoading = signal(false);

  search = signal('');
  showCreateModal = signal(false);
  isSaving = signal(false);

  selectedNote = signal<Note | null>(null);
  showReadModal = signal(false);
  readNote = signal<Note | null>(null);

  isEditMode = computed(() => this.selectedNote() !== null);

  createForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    content: ['', [Validators.required]],
    pinned: [false],
  });

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.isLoading.set(true);

    this.notesService.getNotes().subscribe({
      next: (notes) => {
        this.notes.set(notes);
        this.isLoading.set(false);
      },

      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  filteredNotes = computed(() => {
    const query = this.search().toLowerCase();

    if (!query) {
      return this.notes();
    }

    return this.notes().filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    );
  });
  activeMenuId = signal<string | null>(null);

  openCreateModal(): void {
    this.selectedNote.set(null);

    this.createForm.reset({
      title: '',
      content: '',
      pinned: false,
    });

    this.showCreateModal.set(true);
  }

  openEditModal(note: Note): void {
    this.selectedNote.set(note);

    this.createForm.patchValue({
      title: note.title,
      content: note.content,
      pinned: note.pinned,
    });

    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.selectedNote.set(null);

    this.showCreateModal.set(false);

    this.createForm.reset({
      title: '',
      content: '',
      pinned: false,
    });
  }

  saveNote(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);

    const dto = this.createForm.getRawValue();

    // EDIT MODE
    if (this.selectedNote()) {
      this.notesService.updateNote(this.selectedNote()!.id, dto).subscribe({
        next: (updatedNote) => {
          this.notes.update((notes) =>
            notes.map((note) =>
              note.id === updatedNote.id ? updatedNote : note,
            ),
          );

          this.closeCreateModal();
          this.isSaving.set(false);
        },

        error: (err) => {
          console.error(err);
          this.isSaving.set(false);
        },
      });

      return;
    }

    // CREATE MODE
    this.notesService.createNote(dto).subscribe({
      next: (note) => {
        this.notes.update((notes) => [note, ...notes]);

        this.closeCreateModal();
        this.isSaving.set(false);
      },

      error: (err) => {
        console.error(err);
        this.isSaving.set(false);
      },
    });
  }
  deleteNote(): void {
    const note = this.selectedNote();

    if (!note) {
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete "${note.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    this.notesService.deleteNote(note.id).subscribe({
      next: () => {
        this.notes.update((notes) => notes.filter((n) => n.id !== note.id));

        this.closeCreateModal();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
  }

  openReadModal(note: Note): void {
    this.readNote.set(note);
    this.showReadModal.set(true);
  }

  closeReadModal(): void {
    this.showReadModal.set(false);

    this.readNote.set(null);
  }
  toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();

    if (this.activeMenuId() === id) {
      this.activeMenuId.set(null);
    } else {
      this.activeMenuId.set(id);
    }
  }
  editFromMenu(note: Note, event: MouseEvent): void {
    event.stopPropagation();

    this.activeMenuId.set(null);

    this.openEditModal(note);
  }
  deleteFromMenu(note: Note, event: MouseEvent): void {
    event.stopPropagation();

    this.activeMenuId.set(null);

    this.selectedNote.set(note);

    this.deleteNote();
  }
}
