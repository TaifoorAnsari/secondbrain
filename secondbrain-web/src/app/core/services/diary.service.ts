import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  DiaryEntry,
  CreateDiaryDto,
  UpdateDiaryDto,
} from '../models/diary.model';

@Injectable({
  providedIn: 'root',
})
export class DiaryService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/diary`;


  // ==========================================
  // GET ALL DIARY ENTRIES
  // ==========================================

  getDiaryEntries(): Observable<DiaryEntry[]> {

    return this.http.get<DiaryEntry[]>(
      this.api,
    );

  }


  // ==========================================
  // GET ONE DIARY ENTRY
  // ==========================================

  getDiaryEntry(
    id: string,
  ): Observable<DiaryEntry> {

    return this.http.get<DiaryEntry>(
      `${this.api}/${id}`,
    );

  }


  // ==========================================
  // CREATE DIARY ENTRY
  // ==========================================

  createDiaryEntry(
    dto: CreateDiaryDto,
  ): Observable<DiaryEntry> {

    return this.http.post<DiaryEntry>(
      this.api,
      dto,
    );

  }


  // ==========================================
  // UPDATE DIARY ENTRY
  // ==========================================

  updateDiaryEntry(
    id: string,
    dto: UpdateDiaryDto,
  ): Observable<DiaryEntry> {

    return this.http.patch<DiaryEntry>(
      `${this.api}/${id}`,
      dto,
    );

  }


  // ==========================================
  // DELETE DIARY ENTRY
  // ==========================================

  deleteDiaryEntry(
    id: string,
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.api}/${id}`,
    );

  }

}