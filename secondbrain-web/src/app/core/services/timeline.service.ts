import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  Timeline,
  CreateTimelineDto,
  UpdateTimelineDto,
} from '../models/timeline.model';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/timeline`;

  getTimelines(): Observable<Timeline[]> {

    return this.http.get<Timeline[]>(
      this.api
    );

  }

  getTimeline(
    id: string,
  ): Observable<Timeline> {

    return this.http.get<Timeline>(
      `${this.api}/${id}`
    );

  }

  createTimeline(
    dto: CreateTimelineDto,
  ): Observable<Timeline> {

    return this.http.post<Timeline>(
      this.api,
      dto
    );

  }
quickCapture(
  input: string,
  entityId: string,
): Observable<any> {
  return this.http.post<any>(
    `${this.api}/quick-capture`,
    {
      input,
      entityId,
    }
  );
}

  updateTimeline(
    id: string,
    dto: UpdateTimelineDto,
  ): Observable<Timeline> {

    return this.http.patch<Timeline>(
      `${this.api}/${id}`,
      dto
    );

  }

  deleteTimeline(
    id: string,
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.api}/${id}`
    );

  }

}