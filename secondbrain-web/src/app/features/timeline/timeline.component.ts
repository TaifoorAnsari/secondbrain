import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TimelineService } from '../../core/services/timeline.service';
import { EntitiesService } from '../../core/services/entities.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

import { Timeline } from '../../core/models/timeline.model';
import { Entity } from '../../core/models/entity.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  private timelineService = inject(TimelineService);

  private entitiesService = inject(EntitiesService);

  private fb = inject(FormBuilder);

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private confirmDialog = inject(ConfirmDialogService);

  timelines = signal<Timeline[]>([]);

  entities = signal<Entity[]>([]);

  isLoading = signal(false);

  showModal = signal(false);

  isSaving = signal(false);

  entitySearch = signal('');

selectedEntityIds = signal<string[]>([]);

  selectedTimeline = signal<Timeline | null>(null);
  activeMenuId = signal<string | null>(null);

  isEditMode = computed(() => this.selectedTimeline() !== null);

filteredEntities = computed(() => {

  const search = this.entitySearch()
    .trim()
    .toLowerCase();

  // Don't show anything until user types
  if (!search) {

    return [];

  }

  return this.entities().filter(entity =>

    entity.name
      .toLowerCase()
      .includes(search)

  );

});

selectedEntities = computed(() => {

  return this.entities().filter(entity =>

    this.selectedEntityIds().includes(entity.id),

  );

});

timelineForm = this.fb.nonNullable.group({

  title: [
    '',
    [
      Validators.required,
      Validators.maxLength(150),
    ],
  ],

  description: [
    '',
    [
      Validators.required,
      Validators.maxLength(750),
    ],
  ],

  eventDate: [
    '',
    Validators.required,
  ],

  entityIds: [
    [] as string[],
    Validators.required,
  ],

  showOnCalendar: [
    false,
  ],

});

ngOnInit(): void {

  this.loadTimelines();

  this.loadEntities();

  this.route.queryParams.subscribe(params => {

    const editId = params['edit'];

    if (editId) {

      this.timelineService
        .getTimeline(editId)
        .subscribe({

          next: timeline => {

            this.openEditModal(timeline);

          },

          error: err => {

            console.error(err);

          },

        });

      return;

    }

    const create = params['create'];

    const entityId = params['entity'];

    if (create) {

      this.openModal();

      if (entityId) {

        this.selectedEntityIds.set([entityId]);

        this.timelineForm.patchValue({

          entityIds: [entityId],

        });

      }

    }

    if(params['action'] === 'new') {
      this.openModal()
    }

  });


}

  loadTimelines(): void {
    this.isLoading.set(true);

    this.timelineService.getTimelines().subscribe({
      next: (timelines) => {
        console.log('Timelines loaded:11111', timelines);
        this.timelines.set(timelines);

        this.isLoading.set(false);
      },

      error: (err) => {
        console.error(err);

        this.isLoading.set(false);
      },
    });
  }

  loadEntities(): void {
    this.entitiesService.getEntities().subscribe({
      next: (entities) => {
        this.entities.set(entities);
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  onEntitySearch(event: Event,): void {

  const input =
    event.target as HTMLInputElement;

  this.entitySearch.set(
    input.value,
  );

}

isSelected(
  id: string,
): boolean {

  return this.selectedEntityIds()
    .includes(id);

}

toggleEntity(
  entity: Entity,
): void {

  const ids = [
    ...this.selectedEntityIds(),
  ];

  const index = ids.indexOf(entity.id);

  if (index > -1) {

    ids.splice(index, 1);

  } else {

    ids.push(entity.id);

  }

  this.selectedEntityIds.set(ids);

  this.timelineForm.patchValue({

    entityIds: ids,

  });

  // Clear search after selection

  this.entitySearch.set('');

}

removeEntity(
  id: string,
): void {

  const ids = this.selectedEntityIds()
    .filter(x => x !== id);

  this.selectedEntityIds.set(ids);

  this.timelineForm.patchValue({

    entityIds: ids,

  });

}

 openModal(): void {

  this.selectedTimeline.set(null);

  this.timelineForm.reset({

    title: '',

    description: '',

    eventDate: this.getTodayDateString(),

    entityIds: [],

    showOnCalendar: false,

  });

  this.entitySearch.set('');

  this.selectedEntityIds.set([]);

  this.showModal.set(true);

}
  openTimeline(
  timeline: Timeline,
): void {

  this.router.navigate([
    '/timeline',
    timeline.id,
  ]);

}

openEditModal(
  timeline: Timeline,
): void {

  this.selectedTimeline.set(timeline);

  const entityIds = timeline.entities.map(
    entity => entity.entityId,
  );

  this.selectedEntityIds.set(entityIds);

  this.entitySearch.set('');

  this.timelineForm.patchValue({

    title: timeline.title,

    description: timeline.description,

    eventDate: timeline.eventDate.substring(0, 10),

    entityIds: entityIds,

    showOnCalendar: timeline.showOnCalendar,

  });

  this.showModal.set(true);

}

  saveTimeline(): void {
    if (this.timelineForm.invalid) {
      this.timelineForm.markAllAsTouched();

      return;
    }

    this.isSaving.set(true);

    const dto = this.timelineForm.getRawValue();

    const request = this.isEditMode()
      ? this.timelineService.updateTimeline(this.selectedTimeline()!.id, dto)
      : this.timelineService.createTimeline(dto);

    request.subscribe({
      next: () => {
        this.toast.success(
          this.isEditMode()
            ? 'Timeline updated successfully'
            : 'Timeline created successfully',
        );

        this.closeModal();

        this.loadTimelines();

        this.isSaving.set(false);
      },

      error: (err) => {
        console.error(err);

        this.toast.error('Failed to save timeline');

        this.isSaving.set(false);
      },
    });
  }


closeModal(): void {

  this.selectedTimeline.set(null);

  this.showModal.set(false);

  this.entitySearch.set('');

  this.selectedEntityIds.set([]);

  this.timelineForm.reset({

    title: '',

    description: '',

    eventDate: '',

    entityIds: [],

    showOnCalendar: false,

  });

}
  toggleMenu(
  id: string,
  event: MouseEvent,
): void {

  event.stopPropagation();

  if (this.activeMenuId() === id) {

    this.activeMenuId.set(null);

  } else {

    this.activeMenuId.set(id);

  }

}

@HostListener('document:click')
closeMenu(): void {

  this.activeMenuId.set(null);

}

async deleteTimeline(
  timeline: Timeline,
): Promise<void> {

  const confirmed = await this.confirmDialog.confirm({
    title: 'Delete Timeline',
    message: `Are you sure you want to delete "${timeline.title}"?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
  });

  if (!confirmed) {
    return;
  }

  this.timelineService
    .deleteTimeline(timeline.id)
    .subscribe({

      next: () => {

        this.timelines.update(timelines =>
          timelines.filter(
            item => item.id !== timeline.id
          )
        );

        this.toast.success(
          'Timeline deleted successfully'
        );

      },

      error: (err) => {

        console.error(
          'Failed to delete timeline:',
          err
        );

        this.toast.error(
          'Failed to delete timeline'
        );

      },

    });
}

goBack() {
  this.router.navigate(['/timeline']);
}

private getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
}
