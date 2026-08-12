import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TimelineService } from '../../../core/services/timeline.service';
import { EntitiesService } from '../../../core/services/entities.service';
import { ToastService } from '../../../core/services/toast.service';

import { Entity } from '../../../core/models/entity.model';

@Component({
  selector: 'app-edit-timeline',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-timeline.component.html',
  styleUrls: ['./edit-timeline.component.scss'],
})
export class EditTimelineComponent implements OnInit {

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private fb = inject(FormBuilder);

  private timelineService = inject(TimelineService);

  private entitiesService = inject(EntitiesService);

  private toast = inject(ToastService);

  timelineId = '';

  isLoading = signal(true);

  isSaving = signal(false);

  entities = signal<Entity[]>([]);

  selectedEntities = signal<Entity[]>([]);

  entitySearch = signal('');

  filteredEntities = computed(() => {

    const search = this.entitySearch().toLowerCase();

    return this.entities().filter(entity =>
      entity.name.toLowerCase().includes(search)
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
        Validators.maxLength(500),
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

  });

 ngOnInit(): void {

  const id = this.route.snapshot.paramMap.get('id');

  if (!id) {

    this.router.navigate(['/timeline']);

    return;

  }

  this.timelineId = id;

  this.loadEntities();

  this.loadTimeline();

}
  loadTimeline() {
    throw new Error('Method not implemented.');
  }
loadEntities(): void {

  this.entitiesService
    .getEntities()
    .subscribe({

      next: entities => {

        this.entities.set(entities);

      },

      error: err => {

        console.error(err);

      },

    });

}


}