import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { TimelineService } from '../../../core/services/timeline.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { Timeline } from '../../../core/models/timeline.model';

@Component({
  selector: 'app-timeline-detail',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './timeline-detail.component.html',
  styleUrls: ['./timeline-detail.component.scss'],
})
export class TimelineDetailComponent
  implements OnInit {

  private route = inject(
    ActivatedRoute,
  );

  private router = inject(
    Router,
  );

  private timelineService = inject(
    TimelineService,
  );
private confirmDialog = inject(
  ConfirmDialogService,
);
  timeline = signal<Timeline | null>(
    null,
  );

  isLoading = signal(true);

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get(
        'id',
      );

    if (!id) {

      this.router.navigate([
        '/timeline',
      ]);

      return;

    }

    this.loadTimeline(id);

  }

  loadTimeline(
    id: string,
  ): void {

    this.timelineService
      .getTimeline(id)
      .subscribe({

        next: timeline => {

          this.timeline.set(
            timeline,
          );

          this.isLoading.set(
            false,
          );

        },

        error: (err) => {

          this.isLoading.set(
            false,
          );


          console.error('ERROR', err);

          // this.router.navigate([
          //   '/timeline',
          // ]);

        },

      });

  }

  openEntity(
  entityId: string,
): void {

  this.router.navigate([
    '/entities',
    entityId,
  ]);

}

  goBack(): void {

    this.router.navigate([
      '/timeline',
    ]);

  }

editTimeline(): void {

  const timeline = this.timeline();

  if (!timeline) {

    return;

  }

  this.router.navigate([
    '/timeline',
  ], {

    queryParams: {

      edit: timeline.id,

    },

  });

}
async deleteTimeline(): Promise<void> {

  const timeline = this.timeline();

  if (!timeline) {
    return;
  }

  const confirmed =
    await this.confirmDialog.confirm({
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

        this.router.navigate([
          '/timeline',
        ]);

      },

      error: (err) => {

        console.error(
          'Failed to delete timeline:',
          err
        );

      },

    });
}

}