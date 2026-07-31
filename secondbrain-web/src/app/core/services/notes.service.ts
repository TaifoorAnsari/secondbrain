import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest
} from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/notes`;

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.api);
  }

  getNote(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.api}/${id}`);
  }

  createNote(dto: CreateNoteRequest): Observable<Note> {
    return this.http.post<Note>(this.api, dto);
  }

  updateNote(
    id: string,
    dto: UpdateNoteRequest
  ): Observable<Note> {
    return this.http.patch<Note>(
      `${this.api}/${id}`,
      dto
    );
  }

  deleteNote(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.api}/${id}`
    );
  }
}