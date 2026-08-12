import {
  Component,
  HostListener,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';

import { EntitiesService } from '../../core/services/entities.service';
import { ToastService } from '../../core/services/toast.service';

import {
  CreateEntityDto,
  Entity,
} from '../../core/models/entity.model';

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss'],
})
export class EntitiesComponent implements OnInit {

  peopleCount = signal(0);

  companyCount = signal(0);

  totalEntities = signal(0);

  entities = signal<Entity[]>([]);

  isLoading = signal(false);

  isSaving = signal(false);

  showCreateModal = signal(false);

  selectedEntity = signal<Entity | null>(null);

  activeMenuId = signal<string | null>(null);

  isEditMode = computed(
    () => this.selectedEntity() !== null,
  );

  private entitiesService = inject(EntitiesService);
  private router = inject(Router);

  private fb = inject(FormBuilder);

  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  searchControl = this.fb.nonNullable.control('');

  entityForm = this.fb.nonNullable.group({

    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(100),
      ],
    ],

    type: [
      'PERSON',
      Validators.required,
    ],

    description: [
      '',
      [
        Validators.maxLength(50),
      ],
    ],

  });

  ngOnInit(): void {

    this.loadEntities();

    this.loadStats();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe(value => {

        this.loadEntities(value);

      });
      this.route.queryParams.subscribe(params =>{
        if(params['action'] === 'new') {
          this.openCreateModal()
        }
      })

  }

  loadEntities(search: string = ''): void {

    this.isLoading.set(true);

    this.entitiesService.getEntities(search).subscribe({

      next: (entities) => {

        this.entities.set(entities);

        this.isLoading.set(false);

      },

      error: (err) => {

        console.error(err);

        this.isLoading.set(false);

      },

    });

  }

  loadStats(): void {

    this.entitiesService.getStats().subscribe({

      next: (stats) => {

        this.peopleCount.set(stats.people);

        this.companyCount.set(stats.companies);

        this.totalEntities.set(stats.total);

      },

      error: (err) => {

        console.error(err);

      },

    });

  }

  openCreateModal(): void {

    this.selectedEntity.set(null);

    this.entityForm.reset({

      name: '',

      type: 'PERSON',

      description: '',

    });

    this.showCreateModal.set(true);

  }

  openEditModal(entity: Entity): void {

    this.activeMenuId.set(null);

    this.selectedEntity.set(entity);

    this.entityForm.patchValue({

      name: entity.name,

      type: entity.type,

      description: entity.description ?? '',

    });

    this.showCreateModal.set(true);

  }

  closeCreateModal(): void {

    this.selectedEntity.set(null);

    this.showCreateModal.set(false);

    this.entityForm.reset({

      name: '',

      type: 'PERSON',

      description: '',

    });

  }

  saveEntity(): void {

    if (this.entityForm.invalid) {

      this.entityForm.markAllAsTouched();

      return;

    }

    this.isSaving.set(true);

    const dto =
      this.entityForm.getRawValue() as CreateEntityDto;

    const request = this.isEditMode()

      ? this.entitiesService.updateEntity(
          this.selectedEntity()!.id,
          dto,
        )

      : this.entitiesService.createEntity(dto);

    request.subscribe({

      next: () => {

        this.toast.success(

          this.isEditMode()

            ? 'Entity updated successfully'

            : 'Entity created successfully'

        );

        this.closeCreateModal();

        this.loadEntities(this.searchControl.value);

        this.loadStats();

        this.isSaving.set(false);

      },

      error: (err) => {

        console.error(err);

        if (err.status === 409) {

          this.entityForm.controls.name.setErrors({

            duplicate: true,

          });

          this.toast.error(
            'Entity already exists'
          );

        } else {

          this.toast.error(
            'Failed to save entity'
          );

        }

        this.isSaving.set(false);

      },

    });

  }

  deleteEntity(entity: Entity): void {

    this.activeMenuId.set(null);

    const confirmed = confirm(

      `Delete "${entity.name}"?`

    );

    if (!confirmed) {

      return;

    }

    this.entitiesService
      .deleteEntity(entity.id)
      .subscribe({

        next: () => {

          this.toast.success(
            'Entity deleted successfully'
          );

          this.loadEntities(this.searchControl.value);

          this.loadStats();

        },

        error: (err) => {

          console.error(err);

          this.toast.error(
            'Failed to delete entity'
          );

        },

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

 viewProfile(entity: Entity): void {

  console.log('Clicked');

  console.log(entity);

  this.router.navigate([
    '/entities',
    entity.id,
  ]);

}

}